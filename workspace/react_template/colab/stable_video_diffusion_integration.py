"""
Stable Video Diffusion integration for AnimateAI
Optimized for Google Colab T4 GPU
"""

import os
import sys
import time
import torch
import numpy as np
from PIL import Image
from diffusers import StableVideoDiffusionPipeline
from huggingface_hub import notebook_login
from typing import Dict, List, Optional, Tuple, Union
from IPython.display import display, HTML
import base64
from io import BytesIO

class StableVideoDiffusionService:
    """
    Integration with Stable Video Diffusion for AnimateAI
    Optimized for Google Colab T4 GPU
    """
    
    def __init__(self, model_id: str = "stabilityai/stable-video-diffusion-img2vid-xt", device: str = "cuda"):
        """
        Initialize the Stable Video Diffusion service
        
        Args:
            model_id: The model ID to use from HuggingFace
            device: The device to run the model on (cuda for T4 GPU)
        """
        self.model_id = model_id
        self.device = device
        self.pipeline = None
        self.is_initialized = False
        self.memory_efficient = True  # Default to memory efficient mode for T4
        
    def initialize(self) -> None:
        """
        Initialize the pipeline with the specified model
        Optimized for T4 GPU memory constraints
        """
        try:
            # Check if CUDA is available
            if self.device == "cuda" and not torch.cuda.is_available():
                print("CUDA requested but not available, falling back to CPU")
                self.device = "cpu"
            
            # Load in memory efficient mode for T4 GPU
            if self.memory_efficient and self.device == "cuda":
                self.pipeline = StableVideoDiffusionPipeline.from_pretrained(
                    self.model_id,
                    torch_dtype=torch.float16,
                    variant="fp16"
                )
                self.pipeline.enable_model_cpu_offload()
                # Use attention slicing for T4 memory optimization
                self.pipeline.enable_attention_slicing()
            else:
                self.pipeline = StableVideoDiffusionPipeline.from_pretrained(
                    self.model_id,
                    torch_dtype=torch.float32
                )
                self.pipeline.to(self.device)
            
            self.is_initialized = True
            print(f"✅ Model initialized on {self.device}")
            
            # Print GPU info if available
            if torch.cuda.is_available():
                gpu_name = torch.cuda.get_device_name()
                gpu_memory = torch.cuda.get_device_properties(0).total_memory / 1e9
                print(f"GPU: {gpu_name} with {gpu_memory:.2f} GB memory")
                
        except Exception as e:
            print(f"❌ Failed to initialize model: {str(e)}")
            raise
    
    def generate_video(
        self, 
        image_path: str, 
        motion_strength: float = 0.5,
        duration: float = 3.0,
        fps: int = 24,
        seed: Optional[int] = None,
        output_path: Optional[str] = None
    ) -> str:
        """
        Generate a video from an image using Stable Video Diffusion
        
        Args:
            image_path: Path to the input image
            motion_strength: Strength of the motion (0.0 to 1.0)
            duration: Duration of the video in seconds
            fps: Frames per second for the output video
            seed: Random seed for reproducibility
            output_path: Path to save the output video
            
        Returns:
            Path to the generated video
        """
        if not self.is_initialized:
            self.initialize()
            
        try:
            # Load and preprocess the image
            image = Image.open(image_path)
            
            # Resize image if needed (T4 GPU has memory constraints)
            max_dimension = 768  # Max dimension for T4 GPU
            if max(image.size) > max_dimension:
                ratio = max_dimension / max(image.size)
                new_size = (int(image.size[0] * ratio), int(image.size[1] * ratio))
                image = image.resize(new_size, Image.LANCZOS)
                print(f"Resized image to {new_size} to fit T4 GPU memory constraints")
            
            # Set the random seed if specified
            generator = torch.Generator(device=self.device)
            if seed is not None:
                generator.manual_seed(seed)
            else:
                generator.manual_seed(int(time.time()))
                
            # Calculate number of frames based on duration and fps
            num_frames = int(duration * fps)
            
            # Generate the video frames
            print("🎬 Generating video frames... This may take a minute on T4 GPU.")
            start_time = time.time()
            
            frames = self.pipeline(
                image,
                height=image.size[1],
                width=image.size[0],
                num_frames=num_frames,
                motion_bucket_id=int(motion_strength * 255),  # Scale motion strength to 0-255
                fps=fps,
                generator=generator,
            ).frames
            
            elapsed_time = time.time() - start_time
            print(f"✅ Video generated in {elapsed_time:.2f} seconds")
            
            # Save the video if output path is specified
            if output_path is None:
                # Generate a default output path
                output_dir = os.path.dirname(image_path)
                image_name = os.path.splitext(os.path.basename(image_path))[0]
                output_path = os.path.join(output_dir, f"{image_name}_animated.mp4")
                
            # Convert frames to video and save
            try:
                from torchvision.io import write_video
                
                # Convert frames to format expected by write_video
                video_frames = torch.from_numpy(np.array(frames))
                
                # Write video
                write_video(output_path, video_frames, fps=fps)
                
            except ImportError:
                # Fallback to imageio if torchvision is not available
                import imageio
                
                # Convert frames to uint8
                uint8_frames = [np.array(frame) for frame in frames]
                imageio.mimsave(output_path, uint8_frames, fps=fps)
                
            print(f"💾 Video saved to {output_path}")
            
            return output_path
        
        except Exception as e:
            print(f"❌ Error generating video: {str(e)}")
            raise
            
    def display_video_in_notebook(self, video_path: str) -> None:
        """
        Display a video in the Jupyter/Colab notebook
        
        Args:
            video_path: Path to the video file
        """
        from IPython.display import HTML
        from base64 import b64encode
        
        mp4 = open(video_path, 'rb').read()
        data_url = f"data:video/mp4;base64,{b64encode(mp4).decode()}"
        
        display(HTML(f"""
        <video width="100%" height="auto" controls autoplay loop>
            <source src="{data_url}" type="video/mp4">
        </video>
        """))
    
    def free_memory(self) -> None:
        """Release GPU memory"""
        if self.pipeline is not None:
            del self.pipeline
            self.pipeline = None
            self.is_initialized = False
            
            if torch.cuda.is_available():
                torch.cuda.empty_cache()
                torch.cuda.ipc_collect()
                
            print("🧹 GPU memory cleared")


# REST API for integration with the web interface
from flask import Flask, request, jsonify, send_file
import tempfile
import uuid
import threading

app = Flask(__name__)
svd_service = StableVideoDiffusionService()
processing_jobs = {}

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    gpu_info = "GPU not available"
    if torch.cuda.is_available():
        gpu_info = f"{torch.cuda.get_device_name()} ({torch.cuda.get_device_properties(0).total_memory / 1e9:.2f} GB)"
    
    return jsonify({
        "status": "healthy",
        "model_loaded": svd_service.is_initialized,
        "device": svd_service.device,
        "gpu_info": gpu_info
    })

@app.route('/api/process', methods=['POST'])
def process_image():
    """Process an image to generate a video"""
    if 'image' not in request.files:
        return jsonify({"error": "No image provided"}), 400
    
    # Get parameters
    motion_strength = float(request.form.get('motion_strength', 0.5))
    duration = float(request.form.get('duration', 3.0))
    fps = int(request.form.get('fps', 24))
    
    # Save uploaded image to temp file
    image_file = request.files['image']
    temp_dir = tempfile.mkdtemp()
    image_path = os.path.join(temp_dir, f"input_{uuid.uuid4().hex}.png")
    image_file.save(image_path)
    
    # Generate job ID
    job_id = str(uuid.uuid4())
    processing_jobs[job_id] = {
        "status": "PENDING",
        "progress": 0,
        "output_path": None
    }
    
    # Start processing in background thread
    def process_job():
        try:
            processing_jobs[job_id]["status"] = "PROCESSING"
            output_path = os.path.join(temp_dir, f"output_{job_id}.mp4")
            
            # Generate video
            svd_service.generate_video(
                image_path=image_path,
                motion_strength=motion_strength,
                duration=duration,
                fps=fps,
                output_path=output_path
            )
            
            processing_jobs[job_id]["status"] = "COMPLETED"
            processing_jobs[job_id]["progress"] = 100
            processing_jobs[job_id]["output_path"] = output_path
            
        except Exception as e:
            processing_jobs[job_id]["status"] = "FAILED"
            processing_jobs[job_id]["error"] = str(e)
    
    thread = threading.Thread(target=process_job)
    thread.start()
    
    return jsonify({
        "job_id": job_id,
        "status": "PENDING"
    })

@app.route('/api/jobs/<job_id>', methods=['GET'])
def get_job_status(job_id):
    """Get the status of a processing job"""
    if job_id not in processing_jobs:
        return jsonify({"error": "Job not found"}), 404
    
    return jsonify(processing_jobs[job_id])

@app.route('/api/jobs/<job_id>/video', methods=['GET'])
def get_job_video(job_id):
    """Get the generated video for a completed job"""
    if job_id not in processing_jobs:
        return jsonify({"error": "Job not found"}), 404
    
    job = processing_jobs[job_id]
    if job["status"] != "COMPLETED" or not job["output_path"]:
        return jsonify({"error": "Video not ready"}), 400
    
    return send_file(job["output_path"], mimetype="video/mp4")

def run_api_server(host="0.0.0.0", port=5000):
    """Run the Flask API server"""
    # Initialize service before starting the server
    svd_service.initialize()
    app.run(host=host, port=port)

if __name__ == "__main__":
    # If run directly, start the API server
    run_api_server()