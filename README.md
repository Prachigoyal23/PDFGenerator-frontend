# PDFGenerator-Frontend (React + Tailwind CSS)

Modern, user-friendly React frontend for designing PDF templates, uploading Excel sheets, and generating single or bulk PDFs in seconds.

---

## 🌟 Key Features

1. **Step-by-Step Guided Wizard**:
   - **Step 1: PDF Format**: Pick from pre-built designs (Payment Receipt, Corporate Invoice, Certificate of Excellence, Offer Letter) or launch the built-in HTML/CSS editor.
   - **Step 2: Import Excel**: Drag-and-drop `.xlsx`, `.xls`, or `.csv` files with a single click button to download a ready-to-use sample sheet.
   - **Step 3: Smart Column Mapping**: Automatically detects and matches columns with `{{name}}`, `{{email}}`, `{{phone}}`, `{{amount}}`, `{{address}}`, and provides a live preview table with search.
   - **Step 4: Live PDF Preview & Bulk Export**: Click any row in the dataset to instantly see the pixel-perfect PDF rendering in real-time. Export a single PDF or download all PDFs bundled as a `.zip`.

2. **Built-in HTML/CSS Template Designer**:
   - Write custom HTML and CSS styles.
   - Insert dynamic placeholders with one click.
   - Live test rendering with customizable mock data.
   - Save custom templates directly into your library.

3. **Responsive & Accessible**:
   - Built with Tailwind CSS and Lucide icons.
   - Search and pagination for large spreadsheets.
   - Seamless Vite proxy configuration for zero CORS friction.

---

## 📂 Project Structure

```
PDFGenerator-frontend/
├── src/
│   ├── api/
│   │   └── api.js                  # Axios client for backend APIs
│   ├── components/
│   │   ├── Header.jsx              # App header with backend status monitor
│   │   ├── StepWizard.jsx          # 4-stage interactive workflow progress bar
│   │   ├── TemplateSelector.jsx    # Card-based template picker
│   │   ├── TemplateEditorModal.jsx # Code editor with live preview & save
│   │   ├── ExcelUploader.jsx       # Drag & drop upload & sample download
│   │   ├── ColumnMapper.jsx        # Smart mapping dropdowns & sample row
│   │   ├── DataPreviewTable.jsx    # Searchable, paginated user dataset
│   │   └── PdfLivePreview.jsx      # Live PDF viewer & bulk ZIP export
│   ├── utils/
│   │   └── helpers.js              # Blob downloader & file formatters
│   ├── App.jsx                     # State orchestrator
│   ├── main.jsx                    # React root
│   └── index.css                   # Tailwind styles
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## 🚀 Getting Started

### 1. Installation
```bash
cd PDFGenerator-frontend
npm install
```

### 2. Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Production Build
```bash
npm run build
npm run preview
```
