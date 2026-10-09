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
  Eye
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

export default function AcademicsView({ onDataChanged }) {
  const [academicData, setAcademicData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadingSem, setUploadingSem] = useState(null);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  
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

  const handleSaveSubjectEdit = async (e) => {
    e.preventDefault();
    if (!editingSubject) return;

    try {
      await api.academic.updateSubject({
        semester: editingSubject.semester,
        subjectCode: editingSubject.subjectCode,
        subjectName: editingSubject.subjectName,
        credits: Number(editingSubject.credits),
        grade: editingSubject.grade,
        gradePoint: Number(editingSubject.gradePoint)
      });
      setEditingSubject(null);
      await loadAcademics();
      if (onDataChanged) onDataChanged();
    } catch (err) {
      alert('Failed to update subject: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm">Auditing academic marksheets & calculating CGPA...</span>
      </div>
    );
  }

  const {
    semesters = {},
    calculatedCgpa = 0,
    extractedCgpa = null,
    cgpaDiscrepancy = false,
    discrepancyDelta = 0,
    academicStatus = 'Pending',
    totalCredits = 0,
    activeBacklogs = 0,
    degree = '',
    university = '',
    studentName = '',
    registerNumber = ''
  } = academicData || {};

  const sem1Uploaded = !!semesters['1'];

  return (
    <div className="space-y-6">
      
      {/* Top Header Card */}
      <div className="p-6 bg-slate-900/80 border border-cyan-500/20 rounded-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5 mb-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                academicStatus === 'Academic Records Updated' 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : sem1Uploaded 
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' 
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                {academicStatus}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-400">
                Semester 1 is Mandatory — Semesters 2 to 8 & Consolidated are Optional
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-slate-100 tracking-tight">
              Academic Marksheets & Progressive CGPA Engine
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-2xl">
              Upload marksheets progressively across your college years. The system dynamically audits credits, grades, SGPAs, and performs an independent credit-weighted CGPA reconciliation.
            </p>
          </div>

          {/* Quick CGPA Card */}
          <div className="flex items-center space-x-4 bg-slate-950 p-4 rounded-xl border border-slate-800 shrink-0">
            <div className="text-center px-3 border-r border-slate-800">
              <div className="text-[11px] text-slate-400">Independent CGPA</div>
              <div className="text-2xl font-black text-cyan-400 font-mono">
                {calculatedCgpa ? calculatedCgpa.toFixed(2) : '—'}
              </div>
            </div>
            <div className="text-center px-3 border-r border-slate-800">
              <div className="text-[11px] text-slate-400">Document CGPA</div>
              <div className="text-2xl font-black text-slate-200 font-mono">
                {extractedCgpa ? extractedCgpa.toFixed(2) : '—'}
              </div>
            </div>
            <div className="text-center px-3">
              <div className="text-[11px] text-slate-400">Active Arrears</div>
              <div className={`text-2xl font-black ${activeBacklogs > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                {activeBacklogs}
              </div>
            </div>
          </div>
        </div>

        {/* CGPA Discrepancy Warning Alert */}
        {cgpaDiscrepancy && (
          <div className="mt-4 p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs flex items-start space-x-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">CGPA Discrepancy Warning Flagged:</strong>
              <p className="mt-0.5 text-amber-300/90">
                The document printed CGPA ({extractedCgpa}) differs from the independent credit-weighted sum calculation ({calculatedCgpa.toFixed(2)}) by {discrepancyDelta}. This may be caused by university grade normalization, omitted credits, or an OCR digit recognition variation. You can review and adjust individual subject grades below.
              </p>
            </div>
          </div>
        )}

        {/* Feedback messages */}
        {uploadSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{uploadSuccess}</span>
          </div>
        )}

        {uploadError && (
          <div className="mt-4 p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}
      </div>

      {/* Extracted Student Academic Metadata (if available) */}
      {(studentName || registerNumber || university || degree) && (
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-slate-500 block">Candidate Name:</span>
            <span className="font-semibold text-slate-200">{studentName || '—'}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Roll / Register No:</span>
            <span className="font-mono text-cyan-300 font-semibold">{registerNumber || '—'}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Institution:</span>
            <span className="text-slate-200">{university || '—'}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Degree & Major:</span>
            <span className="text-slate-200">{degree || '—'}</span>
          </div>
        </div>
      )}

      {/* Semesters Upload & Management Grid */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
          <span>Semester Marksheets Upload Tracker</span>
          <span className="text-xs text-slate-500 normal-case font-normal">(Works for students in any year — upload only what you have)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SEMESTERS.map((sem) => {
            const uploadedData = semesters[sem.id];
            const isUploaded = !!uploadedData;
            const isCurrentlyUploading = uploadingSem === sem.id;

            return (
              <div 
                key={sem.id}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  isUploaded 
                    ? 'bg-slate-900/80 border-emerald-500/30' 
                    : sem.isRequired 
                    ? 'bg-slate-900/60 border-amber-500/40 ring-1 ring-amber-500/20' 
                    : 'bg-slate-900/40 border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-200 text-sm">{sem.title}</span>
                    {sem.isRequired ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        REQUIRED
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-400">
                        OPTIONAL
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-400 mb-3">{sem.desc}</p>

                  {/* If Marksheet is uploaded */}
                  {isUploaded ? (
                    <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Status:</span>
                        <span className="text-emerald-400 font-semibold flex items-center">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Verified
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Semester SGPA:</span>
                        <span className="font-mono font-bold text-cyan-300">{uploadedData.sgpa || '—'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Credits Completed:</span>
                        <span className="text-slate-200">{uploadedData.credits || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Subjects Parsed:</span>
                        <span className="text-slate-200">{uploadedData.subjects?.length || 0}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-slate-950/30 border border-dashed border-slate-800 rounded-lg text-center">
                      <p className="text-xs text-slate-500">
                        {sem.isRequired ? 'Upload Semester 1 transcript to begin' : 'Not uploaded yet (optional)'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Upload action box */}
                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  <div className="flex items-center space-x-2">
                    <label className="flex-1 cursor-pointer">
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={(e) => setFileToUpload(e.target.files?.[0] || null)}
                        className="hidden"
                      />
                      <div className="py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs text-center truncate border border-slate-700">
                        {fileToUpload && uploadingSem === sem.id 
                          ? fileToUpload.name 
                          : isUploaded 
                          ? 'Re-upload File' 
                          : 'Choose File'}
                      </div>
                    </label>

                    <button
                      type="button"
                      disabled={isCurrentlyUploading}
                      onClick={() => handleFileUpload(sem.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 shrink-0 ${
                        isUploaded
                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                          : sem.isRequired
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold'
                          : 'bg-cyan-600 hover:bg-cyan-500 text-white'
                      }`}
                    >
                      {isCurrentlyUploading ? (
                        <span className="inline-block animate-spin rounded-full h-3.5 w-3.5 border-2 border-current border-t-transparent" />
                      ) : (
                        <Upload className="w-3.5 h-3.5" />
                      )}
                      <span>{isUploaded ? 'Update' : 'Upload'}</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Extracted Subjects Audit Table */}
      {Object.keys(semesters).length > 0 && (
        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
                <span>OCR Extracted Subjects & Grade Audit</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-500/10 text-cyan-400 font-mono">
                  {Object.values(semesters).reduce((sum, s) => sum + (s.subjects?.length || 0), 0)} Total Courses
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Click "Edit" on any subject to adjust grade points or correct OCR digit recognition.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
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
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {Object.entries(semesters).flatMap(([semKey, semVal]) => 
                  (semVal.subjects || []).map((sub, idx) => (
                    <tr key={`${semKey}-${sub.code || idx}`} className="hover:bg-slate-800/40 transition">
                      <td className="py-2 px-3 text-cyan-400">Sem {semKey}</td>
                      <td className="py-2 px-3 text-slate-200">{sub.code}</td>
                      <td className="py-2 px-3 font-sans font-medium text-slate-100">{sub.name}</td>
                      <td className="py-2 px-3 text-center text-slate-300">{sub.credits}</td>
                      <td className="py-2 px-3 text-center">
                        <span className={`px-1.5 py-0.5 rounded font-bold ${
                          sub.grade === 'O' || sub.grade === 'A+' || sub.grade === 'A'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : sub.grade === 'U' || sub.grade === 'RA' || sub.grade === 'F'
                            ? 'bg-red-500/20 text-red-300'
                            : 'bg-slate-800 text-slate-300'
                        }`}>
                          {sub.grade}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-center font-bold text-slate-100">{sub.gradePoint}</td>
                      <td className="py-2 px-3 text-center">
                        <span className={`text-[10px] ${sub.status === 'Pass' ? 'text-emerald-400' : 'text-red-400'}`}>
                          {sub.status || 'Pass'}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right">
                        <button
                          onClick={() => setEditingSubject({ semester: semKey, subjectCode: sub.code, subjectName: sub.name, credits: sub.credits, grade: sub.grade, gradePoint: sub.gradePoint })}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[10px] font-sans inline-flex items-center space-x-1"
                        >
                          <Edit3 className="w-3 h-3" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-cyan-500/30 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-100">Review & Correct Subject</h3>
              <button onClick={() => setEditingSubject(null)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSubjectEdit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Subject Code</label>
                <input
                  type="text"
                  disabled
                  value={editingSubject.subjectCode}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-400 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Subject Name</label>
                <input
                  type="text"
                  value={editingSubject.subjectName}
                  onChange={(e) => setEditingSubject({ ...editingSubject, subjectName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1">Credits</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="10"
                    value={editingSubject.credits}
                    onChange={(e) => setEditingSubject({ ...editingSubject, credits: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Grade</label>
                  <input
                    type="text"
                    value={editingSubject.grade}
                    onChange={(e) => setEditingSubject({ ...editingSubject, grade: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Grade Point</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={editingSubject.gradePoint}
                    onChange={(e) => setEditingSubject({ ...editingSubject, gradePoint: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100 font-bold"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingSubject(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
                >
                  Save Corrections
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
