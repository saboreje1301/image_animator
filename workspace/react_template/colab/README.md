# Google Colab Integration

This directory contains files for integrating AnimateAI with Google Colab using T4 GPU acceleration.

## Setup Instructions

1. Upload the `animateai_colab.ipynb` notebook to Google Colab
2. Select T4 GPU in runtime settings
3. Follow the instructions in the notebook

## Files

- `animateai_colab.ipynb`: Main notebook for running AnimateAI in Google Colab
- `stable_video_diffusion_integration.py`: Python module for integrating with Stable Video Diffusion
- `pika_labs_integration.py`: Python module for integrating with Pika Labs (coming soon)

## Hardware Requirements

The application is optimized for Google Colab with T4 GPU. The minimum requirements are:

- GPU: NVIDIA T4 or better
- RAM: 12GB+
- Storage: 5GB+ free space

## Troubleshooting

If you encounter any issues with the T4 GPU integration:

1. Make sure you've selected GPU in the runtime settings
2. Try restarting the runtime
3. Check that you have sufficient Colab resource quota
4. Ensure all dependencies are correctly installed

## Performance Considerations

- T4 GPU can process most images in 10-30 seconds depending on complexity
- Higher resolution images will take longer to process
- Using higher quality settings will increase processing time