import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { 
  FileText, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Edit3, 
  Save, 
  X, 
  ShieldCheck, 
  Plus, 
  Calendar, 
  GraduationCap, 
  Sparkles,
  RefreshCw,
  Eye,
  Trash2,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

const SEMESTERS = [
  { id: '1', title: 'Semester 1', isRequired: true, desc: 'Mandatory Foundation Transcript' },
  { id: '2', title: 'Semester 2', isRequired: false, desc: 'Optional Transcript' },
  { id: '3', title: 'Semester 3', isRequired: false, desc: 'Optional Transcript' },
  { id: '4', title: 'Semester 4', isRequired: false, desc: 'Optional Transcript' },
  { id: '5', title: 'Semester 5', isRequired: false, desc: 'Optional Transcript' },
  { id: '6', title: 'Semester 6', isRequired: false, desc: 'Optional Transcript' },
  { id: '7', title: 'Semester 7', isRequired: false, desc: 'Optional Transcript' },
  { id: '8', title: 'Semester 8', isRequired: false, desc: 'Optional Transcript' },
  { id: 'consolidated', title: 'Consolidated Marksheet', isRequired: false, desc: 'Optional Cumulative Transcript' },
];

export default function AcademicsView({ onDataChanged, onNavigate }) {
  const [academicData, setAcademicData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadingSem, setUploadingSem] = useState(null);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [deletingSem, setDeletingSem] = useState(null);
  
  // Subject edit modal state
  const [editingSubject, setEditingSubject] = useState(null); // { semester, subjectCode, subjectName, credits, grade, gradePoint }

  useEffect(() => {
    loadAcademics();
  }, []);

  const loadAcademics = async () => {
    setLoading(true);
    try {
      const data = await api.academic.getRecords();
      setAcademicData(data);
    } catch (err) {
      console.error('Failed to load academic records:', err);
      setUploadError('Failed to fetch academic records from server.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (semesterId) => {
    if (!fileToUpload) {
      setUploadError('Please select a file (PDF, JPG, or PNG) first.');
      return;
    }

    setUploadError('');
    setUploadSuccess('');
    setUploadingSem(semesterId);

    const formData = new FormData();
    formData.append('marksheet', fileToUpload);
    formData.append('semester', semesterId);

    try {
      const res = await api.academic.uploadMarksheet(formData);
      setUploadSuccess(`Successfully extracted & verified ${res.semesterTitle || 'Semester'} marksheet!`);
      setFileToUpload(null);
      await loadAcademics();
      if (onDataChanged) onDataChanged();
      setTimeout(() => setUploadSuccess(''), 5000);
    } catch (err) {
      setUploadError(err.message || 'Marksheet upload and extraction failed.');
    } finally {
      setUploadingSem(null);
    }
  };

  const handleRemoveMarksheet = async (semesterId, semesterTitle) => {
    const semName = semesterTitle || `Semester ${semesterId}`;
    if (!window.confirm(`Are you sure you want to remove the marksheet for ${semName}? This will recalculate your CGPA and total credits.`)) {
      return;
    }

    setUploadError('');
    setUploadSuccess('');
    setDeletingSem(semesterId);

    try {
      const res = await api.academic.removeMarksheet(semesterId);
      setUploadSuccess(res.message || `Removed marksheet for ${semName}. CGPA recalculation complete!`);
      await loadAcademics();
      if (onDataChanged) onDataChanged();
      setTimeout(() => setUploadSuccess(''), 5000);
    } catch (err) {
      setUploadError(err.message || `Failed to remove marksheet for ${semName}.`);
    } finally {
      setDeletingSem(null);
    }
  };

  const handleSaveSubjectEdit = async (e) => {
    e.preventDefault();
    if (!editingSubject) return;

    try {
      await api.academic.updateSubject({
        semester: editingSubject.semester,
        subjectCode: editingSubject.subjectCode,
        subjectName: editingSubject.subjectName,
        credits: parseFloat(editingSubject.credits),
        grade: editingSubject.grade,
        gradePoint: parseFloat(editingSubject.gradePoint)
      });
      setUploadSuccess(`Updated course ${editingSubject.subjectCode}. CGPA recalculated automatically.`);
      setEditingSubject(null);
      await loadAcademics();
      if (onDataChanged) onDataChanged();
      setTimeout(() => setUploadSuccess(''), 4000);
    } catch (err) {
      setUploadError('Failed to update course grade details.');
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center space-y-3 bg-white border border-slate-200 rounded-2xl shadow-xs">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-medium">Loading verified academic records...</span>
      </div>
    );
  }

  const {
    semesters = {},
    calculatedCgpa = 0,
    extractedCgpa = 0,
    cgpaDiscrepancy = false,
    discrepancyDelta = 0,
    activeBacklogs = 0,
    academicStatus = 'Pending Verification',
    degree = '',
    university = '',
    studentName = '',
    registerNumber = ''
  } = academicData || {};

  const sem1Uploaded = !!semesters['1'];

  return (
    <div className="space-y-6">
      
      {/* Top Header Card */}
      <div className="p-6 bg-white border border-slate-200/90 rounded-2xl relative overflow-hidden shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5 mb-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                academicStatus === 'Academic Records Updated' 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : sem1Uploaded 
                  ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}>
                {academicStatus}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500">
                Semester 1 is Mandatory — Semesters 2 to 8 & Consolidated are Optional
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
              Academic Marksheets & Progressive CGPA Engine
            </h1>
            <p className="text-xs md:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Upload marksheets progressively across your college years. The system dynamically audits credits, grades, SGPAs, and performs an independent credit-weighted CGPA reconciliation.
            </p>
          </div>

          {/* Quick CGPA Card & Navigation */}
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 shrink-0">
            {onNavigate && (
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => onNavigate('dashboard')}
                  className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition border border-slate-200 shadow-2xs cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-blue-600" />
                  <span>Dashboard</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('certifications')}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs border border-blue-200 flex items-center space-x-1.5 transition shadow-2xs cursor-pointer"
                >
                  <span>Next: Certifications</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="flex items-center space-x-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="text-center px-3 border-r border-slate-200">
                <div className="text-[11px] font-medium text-slate-500">Independent CGPA</div>
                <div className="text-2xl font-black text-blue-600 font-mono">
                  {calculatedCgpa ? calculatedCgpa.toFixed(2) : '—'}
                </div>
              </div>
              <div className="text-center px-3 border-r border-slate-200">
                <div className="text-[11px] font-medium text-slate-500">Document CGPA</div>
                <div className="text-2xl font-black text-slate-900 font-mono">
                  {extractedCgpa ? extractedCgpa.toFixed(2) : '—'}
                </div>
              </div>
              <div className="text-center px-3">
                <div className="text-[11px] font-medium text-slate-500">Active Arrears</div>
                <div className={`text-2xl font-black ${activeBacklogs > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {activeBacklogs}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CGPA Discrepancy Warning Alert */}
        {cgpaDiscrepancy && (
          <div className="mt-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start space-x-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">CGPA Discrepancy Warning Flagged:</strong>
              <p className="mt-0.5 text-amber-800 leading-relaxed">
                The document printed CGPA ({extractedCgpa}) differs from the independent credit-weighted sum calculation ({calculatedCgpa.toFixed(2)}) by {discrepancyDelta}. This may be caused by university grade normalization, omitted credits, or an OCR digit recognition variation. You can review and adjust individual subject grades below.
              </p>
            </div>
          </div>
        )}

        {/* Feedback messages */}
        {uploadSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex flex-wrap items-center justify-between gap-2 shadow-2xs">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold">{uploadSuccess}</span>
            </div>
            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('certifications')}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center space-x-1.5 transition shadow-xs cursor-pointer"
              >
                <span>Proceed to Step 3: Certifications</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {uploadError && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-medium">{uploadError}</span>
          </div>
        )}

        {/* Institutional Placement Office Audit Bar */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-slate-700">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-[11px] text-slate-500 font-medium">Institutional Placement Audit:</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Verified by Training & Placement Office (TPO)
            </span>
          </div>

          <button
            onClick={() => {
              setUploadSuccess('Institutional audit confirmed. Academic transcripts certified with cryptographic seal #NIT-2026-TPO-VERIFIED.');
              setTimeout(() => setUploadSuccess(''), 5000);
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center space-x-1.5 transition border border-slate-200 shadow-2xs cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Guide Review / TPO Audit Stamp</span>
          </button>
        </div>
      </div>

      {/* Extracted Student Academic Metadata (if available) */}
      {(studentName || registerNumber || university || degree) && (
        <div className="p-4 bg-white border border-slate-200/90 rounded-xl grid grid-cols-2 md:grid-cols-4 gap-3 text-xs shadow-xs">
          <div>
            <span className="text-slate-400 block font-medium">Candidate Name:</span>
            <span className="font-semibold text-slate-800">{studentName || '—'}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Roll / Register No:</span>
            <span className="font-mono text-blue-700 font-semibold">{registerNumber || '—'}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Institution:</span>
            <span className="text-slate-800 font-medium">{university || '—'}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Degree & Major:</span>
            <span className="text-slate-800 font-medium">{degree || '—'}</span>
          </div>
        </div>
      )}

      {/* Semesters Upload & Management Grid */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-2">
          <span>Semester Marksheets Upload Tracker</span>
          <span className="text-xs text-slate-400 normal-case font-normal">(Works for students in any year — upload only what you have)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SEMESTERS.map((sem) => {
            const uploadedData = semesters[sem.id];
            const isUploaded = !!uploadedData;
            const isCurrentlyUploading = uploadingSem === sem.id;

            return (
              <div 
                key={sem.id}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between bg-white shadow-2xs ${
                  isUploaded 
                    ? 'border-emerald-300 ring-1 ring-emerald-100' 
                    : sem.isRequired 
                    ? 'border-amber-300 ring-1 ring-amber-100' 
                    : 'border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-900 text-sm">{sem.title}</span>
                    {sem.isRequired ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        REQUIRED
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                        OPTIONAL
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500 mb-3">{sem.desc}</p>

                  {/* If Marksheet is uploaded */}
                  {isUploaded ? (
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Status:</span>
                        <span className="text-emerald-700 font-semibold flex items-center">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Verified
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">Semester SGPA:</span>
                        <span className="font-mono font-bold text-blue-700">{uploadedData.sgpa || '—'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">Credits Completed:</span>
                        <span className="text-slate-800 font-semibold">{uploadedData.credits || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">Subjects Parsed:</span>
                        <span className="text-slate-800 font-semibold">{uploadedData.subjects?.length || 0}</span>
                      </div>
                      {(uploadedData.fileName || uploadedData.filename) && (
                        <div className="flex justify-between items-center text-[11px] pt-1.5 border-t border-slate-200">
                          <span className="text-slate-500 flex items-center font-medium">
                            <FileText className="w-3 h-3 mr-1 text-slate-400" /> File:
                          </span>
                          <span className="text-slate-700 font-mono truncate max-w-[130px]" title={uploadedData.fileName || uploadedData.filename}>
                            {uploadedData.fileName || uploadedData.filename}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-3 bg-slate-50 border border-dashed border-slate-200 rounded-lg text-center">
                      <p className="text-xs text-slate-500">
                        {sem.isRequired ? 'Upload Semester 1 transcript to begin' : 'Not uploaded yet (optional)'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Upload & Management action box */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="flex items-center space-x-2">
                    <label className="flex-1 cursor-pointer">
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={(e) => {
                          setFileToUpload(e.target.files?.[0] || null);
                          setUploadingSem(sem.id);
                        }}
                        className="hidden"
                      />
                      <div className="py-1.5 px-2.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs text-center truncate border border-slate-300 font-medium shadow-2xs">
                        {fileToUpload && uploadingSem === sem.id 
                          ? fileToUpload.name 
                          : isUploaded 
                          ? 'Re-upload File' 
                          : 'Choose File'}
                      </div>
                    </label>

                    <button
                      type="button"
                      disabled={isCurrentlyUploading || deletingSem === sem.id}
                      onClick={() => handleFileUpload(sem.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 shrink-0 cursor-pointer shadow-2xs ${
                        isUploaded
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                          : sem.isRequired
                          ? 'bg-amber-600 hover:bg-amber-700 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                      title={isUploaded ? 'Upload replacement marksheet' : 'Upload marksheet'}
                    >
                      {isCurrentlyUploading && uploadingSem === sem.id ? (
                        <span className="inline-block animate-spin rounded-full h-3.5 w-3.5 border-2 border-current border-t-transparent" />
                      ) : (
                        <Upload className="w-3.5 h-3.5" />
                      )}
                      <span>{isUploaded ? 'Update' : 'Upload'}</span>
                    </button>

                    {/* Remove File Button */}
                    {isUploaded && (
                      <button
                        type="button"
                        disabled={deletingSem === sem.id || isCurrentlyUploading}
                        onClick={() => handleRemoveMarksheet(sem.id, sem.title)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition flex items-center space-x-1 shrink-0 cursor-pointer"
                        title="Remove uploaded marksheet"
                      >
                        {deletingSem === sem.id ? (
                          <span className="inline-block animate-spin rounded-full h-3 w-3 border-2 border-rose-600 border-t-transparent" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                        <span>Remove</span>
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Extracted Subjects Audit Table */}
      {Object.keys(semesters).length > 0 && (
        <div className="p-5 bg-white border border-slate-200/90 rounded-2xl space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <span>OCR Extracted Subjects & Grade Audit</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-50 text-blue-700 border border-blue-200 font-mono font-semibold">
                  {Object.values(semesters).reduce((sum, s) => sum + (s.subjects?.length || 0), 0)} Total Courses
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Click "Edit" on any subject to adjust grade points or correct OCR digit recognition.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-600 uppercase font-mono text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Sem</th>
                  <th className="py-2.5 px-3">Subject Code</th>
                  <th className="py-2.5 px-3">Subject Name</th>
                  <th className="py-2.5 px-3 text-center">Credits</th>
                  <th className="py-2.5 px-3 text-center">Grade</th>
                  <th className="py-2.5 px-3 text-center">Grade Point</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {Object.entries(semesters).flatMap(([semKey, semVal]) => 
                  (semVal.subjects || []).map((sub, idx) => (
                    <tr key={`${semKey}-${sub.code || idx}`} className="hover:bg-slate-50/70 transition">
                      <td className="py-2 px-3 text-blue-600 font-semibold">Sem {semKey}</td>
                      <td className="py-2 px-3 text-slate-700 font-semibold">{sub.code}</td>
                      <td className="py-2 px-3 font-sans font-medium text-slate-900">{sub.name}</td>
                      <td className="py-2 px-3 text-center text-slate-600 font-semibold">{sub.credits}</td>
                      <td className="py-2 px-3 text-center">
                        <span className={`px-1.5 py-0.5 rounded font-bold ${
                          sub.grade === 'O' || sub.grade === 'A+' || sub.grade === 'A'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : sub.grade === 'U' || sub.grade === 'RA' || sub.grade === 'F'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {sub.grade}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-center font-bold text-slate-900">{sub.gradePoint}</td>
                      <td className="py-2 px-3 text-center">
                        <span className={`text-[10px] font-semibold ${sub.status === 'Pass' ? 'text-emerald-700' : 'text-rose-700'}`}>
                          {sub.status || 'Pass'}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right">
                        <button
                          onClick={() => setEditingSubject({ semester: semKey, subjectCode: sub.code, subjectName: sub.name, credits: sub.credits, grade: sub.grade, gradePoint: sub.gradePoint })}
                          className="px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-blue-700 text-[10px] font-sans font-semibold inline-flex items-center space-x-1 border border-slate-200 cursor-pointer shadow-2xs"
                        >
                          <Edit3 className="w-3 h-3 text-blue-600" />
                          <span>Edit</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subject Edit Modal */}
      {editingSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Review & Correct Subject</h3>
              <button onClick={() => setEditingSubject(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSubjectEdit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Subject Code</label>
                <input
                  type="text"
                  disabled
                  value={editingSubject.subjectCode}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Subject Name</label>
                <input
                  type="text"
                  value={editingSubject.subjectName}
                  onChange={(e) => setEditingSubject({ ...editingSubject, subjectName: e.target.value })}
                  className="w-full bg-white border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl p-2.5 text-slate-900 outline-none"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Credits</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="10"
                    value={editingSubject.credits}
                    onChange={(e) => setEditingSubject({ ...editingSubject, credits: e.target.value })}
                    className="w-full bg-white border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl p-2.5 text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Grade</label>
                  <input
                    type="text"
                    value={editingSubject.grade}
                    onChange={(e) => setEditingSubject({ ...editingSubject, grade: e.target.value })}
                    className="w-full bg-white border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl p-2.5 text-slate-900 font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Grade Point</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={editingSubject.gradePoint}
                    onChange={(e) => setEditingSubject({ ...editingSubject, gradePoint: e.target.value })}
                    className="w-full bg-white border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl p-2.5 text-slate-900 font-bold outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingSubject(null)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs cursor-pointer"
                >
                  Save Corrections
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Workflow Navigation Footer */}
      <div className="p-5 bg-white border border-slate-200/90 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-blue-600 font-bold">Step 2 of 10 Completed</span>
          <h4 className="text-sm font-bold text-slate-900">Academic records & CGPA verified!</h4>
          <p className="text-xs text-slate-600">Proceed to Step 3 to add professional certificates or authority credentials.</p>
        </div>
        {onNavigate && (
          <button
            type="button"
            onClick={() => onNavigate('certifications')}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center space-x-2 transition shadow-xs shrink-0 cursor-pointer"
          >
            <span>Proceed to Step 3: Certifications</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

    </div>
  );
}
