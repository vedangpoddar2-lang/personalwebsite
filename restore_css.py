import subprocess

try:
    with open('restored_timeline.css', 'w', encoding='utf-8') as f:
        subprocess.run(['git', 'show', 'HEAD:components/Timeline.module.css'], stdout=f, check=True)
    print("Successfully restored file.")
except Exception as e:
    print(f"Error: {e}")
