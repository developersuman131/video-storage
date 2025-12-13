async function uploadMusic() {
  const fileInput = document.getElementById("fileInput");
  const songName = document.getElementById("songName").value.trim();
  const artistName = document.getElementById("artistName").value.trim();
  const file = fileInput.files[0];
  const statusEl = document.getElementById("status");

  if (!file) { alert("Please select an audio file!"); return; }
  if (!songName || !artistName) { alert("Enter song name and artist"); return; }

  const reader = new FileReader();
  reader.onload = async function() {
    const base64Content = reader.result.split(",")[1]; // get base64 part

    statusEl.innerText = "Uploading... please wait";

    try {
      const res = await fetch(`${backendURL}/upload`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          filename: "music/" + file.name, 
          content: base64Content,
          name: songName,
          artist: artistName
        })
      });

      const data = await res.json();

      if (data.success) {
        statusEl.innerHTML = `Upload successful!<br><a href="${data.download_url}" target="_blank">Play Song</a>`;
        fileInput.value = "";
        document.getElementById("songName").value = "";
        document.getElementById("artistName").value = "";
        loadMusic();
      } else {
        statusEl.innerText = `Upload failed: ${data.error}`;
      }
    } catch(err) {
      statusEl.innerText = `Error: ${err.message}`;
    }
  };
  reader.readAsDataURL(file); // triggers reader.onload
}
