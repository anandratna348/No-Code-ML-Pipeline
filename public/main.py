"""
FastAPI ML Pipeline Backend
Run locally: uvicorn main:app --reload --port 8000
"""

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score, confusion_matrix
import io

app = FastAPI(title="ML Pipeline API")

# -------------------- CORS --------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- SESSION STORAGE --------------------
session_data = {
    "df": None,
    "X": None,
    "y": None,
    "X_train": None,
    "X_test": None,
    "y_train": None,
    "y_test": None,
    "numeric_columns": [],
    "scaler": None,
}

# -------------------- REQUEST MODELS --------------------
class PreprocessRequest(BaseModel):
    standardization: bool = False
    normalization: bool = False


class SplitRequest(BaseModel):
    ratio: str = "80-20"


class TrainRequest(BaseModel):
    model: str


# -------------------- HELPERS --------------------
def reset_session():
    session_data.update({
        "df": None,
        "X": None,
        "y": None,
        "X_train": None,
        "X_test": None,
        "y_train": None,
        "y_test": None,
        "numeric_columns": [],
        "scaler": None,
    })


# -------------------- ROUTES --------------------

@app.post("/upload")
async def upload_dataset(file: UploadFile = File(...)):
    """Upload CSV / Excel dataset"""
    try:
        reset_session()

        filename = file.filename.lower()
        content = await file.read()

        if filename.endswith(".csv"):
            df = pd.read_csv(io.BytesIO(content))
        elif filename.endswith(".xlsx"):
            df = pd.read_excel(io.BytesIO(content))
        else:
            raise HTTPException(400, "Only CSV and Excel files are supported")

        if df.empty:
            raise HTTPException(400, "Uploaded file is empty")

        # Save dataset
        session_data["df"] = df

        # Features & target (last column = target)
        X = df.iloc[:, :-1]
        y = df.iloc[:, -1]

        session_data["X"] = X
        session_data["y"] = y

        # Numeric columns (exclude target)
        numeric_cols = X.select_dtypes(include=[np.number]).columns.tolist()
        session_data["numeric_columns"] = numeric_cols

        return {
            "filename": file.filename,
            "rows": len(df),
            "columns": df.columns.tolist(),          # ✅ frontend-safe
            "numericColumns": numeric_cols,
            "preview": df.head(5).to_dict(orient="records"),
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(400, f"Upload error: {str(e)}")


@app.post("/preprocess")
async def preprocess_data(request: PreprocessRequest):
    if session_data["X"] is None:
        raise HTTPException(400, "No dataset uploaded")

    try:
        X = session_data["X"].copy()
        numeric_cols = session_data["numeric_columns"]

        if numeric_cols:
            if request.standardization:
                scaler = StandardScaler()
                X[numeric_cols] = scaler.fit_transform(X[numeric_cols])
                session_data["scaler"] = scaler
            elif request.normalization:
                scaler = MinMaxScaler()
                X[numeric_cols] = scaler.fit_transform(X[numeric_cols])
                session_data["scaler"] = scaler

        session_data["X"] = X

        return {
            "success": True,
            "message": "Preprocessing applied successfully"
        }

    except Exception as e:
        raise HTTPException(400, f"Preprocessing error: {str(e)}")


@app.post("/split")
async def split_data(request: SplitRequest):
    if session_data["X"] is None:
        raise HTTPException(400, "No dataset uploaded")

    try:
        test_size = 0.2 if request.ratio == "80-20" else 0.3

        X_train, X_test, y_train, y_test = train_test_split(
            session_data["X"],
            session_data["y"],
            test_size=test_size,
            random_state=42,
            stratify=session_data["y"] if session_data["y"].nunique() > 1 else None
        )

        session_data["X_train"] = X_train
        session_data["X_test"] = X_test
        session_data["y_train"] = y_train
        session_data["y_test"] = y_test

        return {
            "success": True,
            "trainSize": len(X_train),
            "testSize": len(X_test),
            "message": f"Data split {request.ratio}"
        }

    except Exception as e:
        raise HTTPException(400, f"Split error: {str(e)}")


@app.post("/train")
async def train_model(request: TrainRequest):
    if session_data["X_train"] is None:
        raise HTTPException(400, "Please split data before training")

    try:
        X_train = session_data["X_train"]
        X_test = session_data["X_test"]
        y_train = session_data["y_train"]
        y_test = session_data["y_test"]

        # Encode categorical features
        X_train_enc = pd.get_dummies(X_train, drop_first=True)
        X_test_enc = pd.get_dummies(X_test, drop_first=True)
        X_train_enc, X_test_enc = X_train_enc.align(
            X_test_enc, join="left", axis=1, fill_value=0
        )

        if request.model == "logistic_regression":
            model = LogisticRegression(max_iter=1000)
        elif request.model == "decision_tree":
            model = DecisionTreeClassifier(max_depth=10, random_state=42)
        else:
            raise HTTPException(400, "Invalid model type")

        model.fit(X_train_enc, y_train)
        y_pred = model.predict(X_test_enc)

        accuracy = accuracy_score(y_test, y_pred)
        cm = confusion_matrix(y_test, y_pred)

        return {
            "model": request.model,
            "accuracy": float(accuracy),
            "confusionMatrix": cm.tolist(),
            "classLabels": [str(c) for c in sorted(y_test.unique())],
            "trainSize": len(X_train),
            "testSize": len(X_test),
        }

    except Exception as e:
        raise HTTPException(400, f"Training error: {str(e)}")


@app.post("/reset")
async def reset():
    reset_session()
    return {"success": True}


@app.get("/health")
async def health():
    return {"status": "healthy"}
