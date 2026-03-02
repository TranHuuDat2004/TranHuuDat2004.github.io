import imageio

input_path = "webp_file.webp"
output_path = "mp4_file.mp4"

print("Reading webp...")
reader = imageio.get_reader(input_path)

try:
    fps = reader.get_meta_data().get('fps', 10)
    if fps == 0: fps = 10
except Exception:
    fps = 10

print(f"Writing mp4 with fps={fps}...")
# macro_block_size=2 ensures width/height are padded to even numbers, required by libx264
writer = imageio.get_writer(output_path, fps=fps, codec='libx264', macro_block_size=2)

for count, frame in enumerate(reader):
    writer.append_data(frame)
    if count % 50 == 0:
        print(f"Processed {count} frames...")

writer.close()
print("Conversion complete!")