# 🩺 Skin Cancer Detection AI (Pro)

An advanced, deep-learning-based medical application designed to assist in the identification of skin lesions, specifically distinguishing between **Melanoma** and **Non-Melanoma** cases. This project implements state-of-the-art "Explainable AI" to provide transparency in medical decision-making.

## 🚀 Live Demo
**[View the Web App Here](https://skin-cancerai.streamlit.app)**

## ✨ Key Features
- **High Accuracy Classification:** Powered by a fine-tuned **ResNet18** deep learning model.
- **Explainable AI (Grad-CAM):** Generates heatmaps over skin images to show exactly which features the AI focused on.
- **Multi-Spot Detection:** Uses OpenCV to automatically identify and analyze multiple lesions in a single large-scale photo.
- **Medical PDF Reporting:** Automatically generates a formal PDF report including the AI diagnosis, confidence scores, and visual evidence (heatmaps).
- **GPU Accelerated:** Optimized for training and inference using NVIDIA CUDA.

## 🛠️ Technologies Used
- **Language:** Python 3.11
- **Deep Learning Framework:** PyTorch
- **Web Interface:** Streamlit
- **Computer Vision:** OpenCV
- **Reporting:** FPDF2
- **Hardware:** NVIDIA RTX Series GPU (via CUDA 12.1)

## 📊 Model Performance
- **Accuracy:** ~95.6%
- **Validation Recall:** ~93.2% (Optimized for minimizing missed Melanoma cases)
- **Training Epochs:** 10
- **Optimization:** Adam Optimizer with Cross-Entropy Loss

## 📁 Project Structure
- `app.py`: The main Streamlit web application.
- `skin_model.pth`: The trained PyTorch model weights.
- `train_skin_cancer.py`: The script used to train the model on a local GPU.
- `evaluate.py`: Statistical analysis tool (Confusion Matrix generator).
- `requirements.txt`: List of dependencies for cloud deployment.

## ⚙️ Local Installation
To run this project on your own computer:

1. Clone the repository:
   ```bash
   git clone https://github.com/Phionephione/skin-cancer-ai.git
   cd skin-cancer-ai
