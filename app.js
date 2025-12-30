const { jsPDF } = window.jspdf;

const input = document.getElementById("imageInput");
const previewArea = document.getElementById("previewArea");
const fileCount = document.getElementById("fileCount");

input.addEventListener("change", () => {
  previewArea.innerHTML = "";
  fileCount.textContent = `${input.files.length} files selected`;

  [...input.files].forEach(file => {
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    previewArea.appendChild(img);
  });
});

document.getElementById("convertBtn").addEventListener("click", () => {
  const orientation = document.getElementById("orientation").value;
  const pdf = new jsPDF({ orientation });

  [...input.files].forEach((file, index) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();

      if (index > 0) pdf.addPage();
      pdf.addImage(img, "JPEG", 0, 0, width, height);

      if (index === input.files.length - 1) {
        pdf.save("images.pdf");
      }
    };
  });
});
