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

document.getElementById("convertBtn").addEventListener("click", async () => {
  if (!input.files.length) {
    alert("Please select images");
    return;
  }

  const orientation =
    document.querySelector('input[name="orientation"]:checked').value;

  const pageSize =
    document.getElementById("pageSize").value === "letter"
      ? "letter"
      : "a4";

  const margin =
    parseInt(document.querySelector('input[name="margin"]:checked').value);

  const pdf = new jsPDF({
    orientation,
    unit: "pt",
    format: pageSize
  });

  for (let i = 0; i < input.files.length; i++) {
    const imgFile = input.files[i];
    const img = new Image();
    img.src = URL.createObjectURL(imgFile);

    await new Promise(resolve => {
      img.onload = () => {
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        const maxWidth = pageWidth - margin * 2;
        const maxHeight = pageHeight - margin * 2;

        // Maintain aspect ratio
        let width = img.width;
        let height = img.height;
        const ratio = Math.min(maxWidth / width, maxHeight / height);

        width *= ratio;
        height *= ratio;

        const x = (pageWidth - width) / 2;
        const y = (pageHeight - height) / 2;

        if (i > 0) pdf.addPage();
        pdf.addImage(img, "JPEG", x, y, width, height);

        resolve();
      };
    });
  }

  pdf.save("images.pdf");
});
