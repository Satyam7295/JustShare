import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { formatDistanceToNowStrict, differenceInDays } from "date-fns";
import {
  FaWhatsapp,
  FaTelegramPlane,
  FaInstagram,
  FaEnvelope,
  FaHeadset,
  FaDownload,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { FaEye, FaShare, FaTrashAlt } from "react-icons/fa";

const GuestFilePreview = ({ guestFiles }) => {
  const dispatch = useDispatch();
  const [files, setFiles] = useState(guestFiles || []);
  const [previewFile, setPreviewFile] = useState(null);
  const [shareFile, setShareFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const sortFileName = (filename) => {
    // Sort the file name to ensure consistent display
    return filename.length > 20 ? `${filename.slice(0, 20)}...` : filename;
  };

  function handleShare(shortUrl) {
    const frontendBaseUrl = window.location.origin;
    const fullUrl = `${frontendBaseUrl}${shortUrl}`;

    return {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(
        "Download file: " + fullUrl
      )}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        fullUrl
      )}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        fullUrl
      )}&text=Check this out!`,
      email: `mailto:?subject=Shared File&body=${encodeURIComponent(
        "Here’s your file: " + fullUrl
      )}`,
      copy: fullUrl,
      qr: `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
        fullUrl
      )}&size=150x150`,
    };
  }

  const deleteFile = (fileId) => {
    if (!fileId) {
      toast.error("File ID is invalid.");
      return;
    }

    const updatedFiles = files.filter((file) => file.id !== fileId);

    setFiles(updatedFiles);
    localStorage.setItem("guestFiles", JSON.stringify(updatedFiles));

    // Re-sync from localStorage (if that's your source of truth)
    const refreshedFiles = JSON.parse(localStorage.getItem("guestFiles")) || [];
    setFiles(refreshedFiles);

    toast.success("File deleted successfully!");
  };

  useEffect(() => {
    setFiles(guestFiles);
  }, [guestFiles]);



  const filteredFiles = files?.filter((file) => {
    const nameMatch = file.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const typeMatch = filterType ? file.type === filterType : true;

    const statusMatch = filterStatus
      ? filterStatus === "expired"
        ? differenceInDays(new Date(file.expiresAt), new Date()) <= 0
        : differenceInDays(new Date(file.expiresAt), new Date()) > 0
      : true;

    return nameMatch && typeMatch && statusMatch;
  });

  const totalPages = Math.ceil((filteredFiles?.length || 0) / itemsPerPage);
  const paginatedFiles = filteredFiles?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const downloadQRCode = async (shortUrl) => {
  const qrUrl = handleShare(shortUrl).qr;

  try {
    const response = await fetch(qrUrl);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = "qr-code.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the blob URL
    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("QR code download failed:", error);
    alert("Failed to download QR code. Please try again.");
  }
};


  return (
    <div className="flex flex-col mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-[var(--primary-text)] mb-4">📁 Your Uploaded Files</h2>
        <p className="text-sm text-[var(--primary-text)]">
          Showing {filteredFiles.length} file{filteredFiles.length !== 1 && "s"}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 w-full lg:items-center mb-6">
        <div className="relative flex-1">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 pr-4 py-3 w-full rounded-xl font-medium bg-white/5 border border-white/10 placeholder-gray-500 text-[var(--text-color)] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            placeholder="Search by file name..."
            aria-label="Search"
          />
        </div>

        <select
          className="px-4 py-3 rounded-xl font-medium bg-white/5 border border-white/10 text-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all outline-none cursor-pointer"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="" className="bg-gray-900 text-white">All Types</option>
          {[...new Set(files?.map((f) => f.type))].map((type) => (
            <option key={type} value={type} className="bg-gray-900 text-white">
              {type}
            </option>
          ))}
        </select>

        <select
          className="px-4 py-3 rounded-xl font-medium bg-white/5 border border-white/10 text-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all outline-none cursor-pointer"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="" className="bg-gray-900 text-white">All Status</option>
          <option value="active" className="bg-gray-900 text-white">Active</option>
          <option value="expired" className="bg-gray-900 text-white">Expired</option>
        </select>

        {(filterType || filterStatus || searchTerm) && (
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterType("");
              setFilterStatus("");
            }}
            className="px-5 py-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-all text-sm font-semibold tracking-wide"
          >
            Reset
          </button>
        )}
      </div>

      {!files || files.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center glass-panel mt-4">
          <p className="text-gray-400 text-lg">No files uploaded yet.</p>
        </div>
      ) : (
        <div className="-my-2 overflow-x-auto">
          <div className="inline-block min-w-full py-2 align-middle">
            <div className="glass-panel overflow-hidden border border-white/10 shadow-lg">
              <table className="min-w-full divide-y divide-white/10 text-[var(--text-color)]">
                <thead className="bg-white/5 text-gray-300 hidden md:table-header-group">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">File Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Size</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider hidden lg:table-cell">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider hidden xl:table-cell">Download</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Actions</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider hidden md:table-cell">Expiry At</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider hidden lg:table-cell">Uploaded At</th>
                  </tr>
                </thead>

                <tbody className="bg-[var(--bg-color)] divide-y divide-[var(--border-color)]">
                  {paginatedFiles?.map((file) => {
                    const shareLinks = handleShare(file.shortUrl);
                    const formattedSize =
                      file.size > 1024 * 1024
                        ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                        : file.size > 1024
                        ? `${(file.size / 1024).toFixed(2)} KB`
                        : `${file.size} Bytes`;

                    const isExpired =
                      differenceInDays(new Date(file.expiresAt), new Date()) <=
                      0;

                    return (
                      <>
                        {/* Desktop Row */}
                        <tr
                          key={file._id}
                          className="hover:bg-[var(--hover-bg-color)] hidden md:table-row"
                        >
                          <td className="px-4 py-3 text-sm max-w-[150px] truncate" title={file.name}>
                            {sortFileName(file.name)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-400 whitespace-nowrap">
                            {formattedSize}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-400 hidden lg:table-cell max-w-[100px] truncate" title={file.type}>
                            {file.type}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-400 hidden xl:table-cell">
                            {file.downloadedContent}
                          </td>
                          <td className="px-4 py-3 text-sm whitespace-nowrap">
                            <span
                              className={`font-medium ${
                                file.status === "active"
                                  ? "text-green-500"
                                  : "text-red-500"
                              }`}
                            >
                              {file.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 flex items-center gap-2 text-sm whitespace-nowrap">
                            <button
                              onClick={() => setPreviewFile(file)}
                              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1a1a1c] border border-gray-200 dark:border-[#2c2c2e] rounded-lg hover:bg-gray-50 dark:hover:bg-[#2c2c2e] transition-colors"
                            >
                              <FaEye className="text-gray-500 dark:text-gray-400" /> Preview
                            </button>

                            {/* Share */}
                            <button
                              onClick={() => setShareFile(file)}
                              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1a1a1c] border border-gray-200 dark:border-[#2c2c2e] rounded-lg hover:bg-gray-50 dark:hover:bg-[#2c2c2e] transition-colors"
                            >
                              <FaShare className="text-gray-500 dark:text-gray-400" /> Share
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => deleteFile(file.id)}
                              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 bg-white dark:bg-[#1a1a1c] border border-gray-200 dark:border-[#2c2c2e] rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                              <FaTrashAlt className="text-red-500 dark:text-red-400/80" /> Delete
                            </button>
                          </td>
                          <td className="px-4 py-3 text-sm text-red-500 whitespace-nowrap hidden md:table-cell">
                            {isExpired
                              ? "Expired"
                              : `Expires in ${differenceInDays(
                                  new Date(file.expiresAt),
                                  new Date()
                                )} days`}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-400 hidden lg:table-cell whitespace-nowrap">
                            {formatDistanceToNowStrict(
                              new Date(file.createdAt),
                              {
                                addSuffix: true,
                              }
                            )}
                          </td>
                        </tr>

                        {/* Mobile Card */}
                        <tr
                          key={`mobile-${file._id}`}
                          className="block md:hidden border-b border-gray-200"
                        >
                          <td className="block px-4 py-4">
                            <div className="mb-2">
                              <strong className="text-gray-700 dark:text-gray-200">
                                📄 {sortFileName(file.name)}
                              </strong>
                              <div className="text-xs text-gray-400">
                                {file.type} | {formattedSize}
                              </div>
                            </div>
                            <div className="text-sm text-gray-400 mb-1">
                              <span className="font-medium">Status: </span>
                              <span
                                className={
                                  file.status === "active"
                                    ? "text-green-600"
                                    : "text-red-500"
                                }
                              >
                                {file.status}
                              </span>
                            </div>
                            <div className="text-sm text-gray-400 mb-1">
                              <span className="font-medium">Downloaded:</span>{" "}
                              {file.downloadedContent}
                            </div>
                            <div className="text-sm text-gray-400 mb-1">
                              <span className="font-medium">Expiry:</span>{" "}
                              {isExpired
                                ? "Expired"
                                : `Expires in ${differenceInDays(
                                    new Date(file.expiresAt),
                                    new Date()
                                  )} days`}
                            </div>
                            <div className="text-sm text-gray-400 mb-1">
                              <span className="font-medium">Uploaded:</span>{" "}
                              {formatDistanceToNowStrict(new Date(file.createdAt), {
                                addSuffix: true,
                              })}
                            </div>

                            <div className="flex flex-wrap gap-3 mt-3">
                             <button
                              onClick={() => setPreviewFile(file)}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1a1a1c] border border-gray-200 dark:border-[#2c2c2e] rounded-lg hover:bg-gray-50 dark:hover:bg-[#2c2c2e] transition-colors"
                            >
                              <FaEye className="text-gray-500 dark:text-gray-400" /> Preview
                            </button>

                            {/* Share */}
                            <button
                              onClick={() => setShareFile(file)}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1a1a1c] border border-gray-200 dark:border-[#2c2c2e] rounded-lg hover:bg-gray-50 dark:hover:bg-[#2c2c2e] transition-colors"
                            >
                              <FaShare className="text-gray-500 dark:text-gray-400" /> Share
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => deleteFile(file.id)}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 bg-white dark:bg-[#1a1a1c] border border-gray-200 dark:border-[#2c2c2e] rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                              <FaTrashAlt className="text-red-500 dark:text-red-400/80" /> Delete
                            </button>
                            </div>
                          </td>
                        </tr>
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-4 px-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded text-white bg-[var(--primary-text)] hover:opacity-90 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-300 dark:text-gray-400">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded text-white bg-[var(--primary-text)] hover:opacity-90 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-6 text-center text-sm">
  Want to save your progress?{" "}
  <Link
    to="/login"
    className="text-blue-600 dark:text-blue-400 font-medium hover:underline hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
  >
    Log in
  </Link>{" "}
  or{" "}
  <Link
    to="/signup"
    className="text-blue-600 dark:text-blue-400 font-medium hover:underline hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
  >
    Create an account
  </Link>
</p>

        </div>
      )}

      {/* Preview Modal */}
      {previewFile && createPortal(
        <div className="fixed inset-0 bg-white/80 dark:bg-black/90 flex items-start justify-center z-[9999] p-4 pt-20 sm:pt-28 animate-fade-in overflow-y-auto">
          <div className="glass-panel p-6 max-w-2xl w-full animate-slide-up relative">
            <button 
              onClick={() => setPreviewFile(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-[var(--primary-text)] pr-6 truncate">{previewFile.name}</h3>
            {/* File Preview */}
            <div className="rounded-xl overflow-hidden bg-gray-100 dark:bg-black/20 border border-gray-200 dark:border-white/5 p-2">
              {previewFile.type.startsWith("image/") && (
                <img
                  src={previewFile.path}
                  alt={previewFile.name}
                  className="w-full h-auto rounded-lg object-contain max-h-[60vh]"
                />
              )}
              {previewFile.type.startsWith("video/") && (
                <video controls className="w-full h-auto rounded-lg max-h-[60vh]">
                  <source src={previewFile.path} type={previewFile.type} />
                  Your browser does not support the video tag.
                </video>
              )}
              {previewFile.type.startsWith("audio/") && (
                <audio controls className="w-full h-auto rounded-lg">
                  <source src={previewFile.path} type={previewFile.type} />
                  Your browser does not support the audio element.
                </audio>
              )}
              {previewFile.type === "application/pdf" && (
                <iframe
                  src={previewFile.path}
                  title="PDF Preview"
                  className="w-full h-[60vh] rounded-lg bg-white"
                ></iframe>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Share Modal */}
      {shareFile && createPortal(
        <div className="fixed inset-0 bg-white/80 dark:bg-black/90 flex items-start justify-center z-[9999] p-4 pt-20 sm:pt-28 animate-fade-in overflow-y-auto">
          <div className="glass-panel p-5 sm:p-6 max-w-lg w-full animate-slide-up relative">
            <button 
              onClick={() => setShareFile(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl transition-colors"
            >
              &times;
            </button>
            <div className="flex justify-center mb-2">
              <img src="/filetransfergif.gif" alt="Share animation" className="w-16 h-16 object-contain opacity-90 dark:opacity-80" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-white truncate px-4">
              Share File
            </h3>

            <div className="grid grid-cols-2 gap-3 text-[var(--text-color)]">
              <a
                href={handleShare(shareFile.shortUrl).whatsapp}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 p-3 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 hover:border-green-500/50 transition-all group"
              >
                <FaWhatsapp className="text-green-500 text-xl group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-sm">WhatsApp</span>
              </a>

              <a
                href={handleShare(shareFile.shortUrl).instagram || "#"}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 p-3 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 hover:border-pink-500/50 transition-all group"
              >
                <FaInstagram className="text-pink-500 text-xl group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-sm">Instagram</span>
              </a>

              <a
                href={handleShare(shareFile.shortUrl).telegram}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 p-3 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 hover:border-blue-500/50 transition-all group"
              >
                <FaTelegramPlane className="text-blue-500 text-xl group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-sm">Telegram</span>
              </a>

              <a
                href={handleShare(shareFile.shortUrl).email}
                className="flex items-center justify-center gap-2 p-3 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 hover:border-red-500/50 transition-all group"
              >
                <FaEnvelope className="text-red-500 text-xl group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-sm">Email</span>
              </a>
            </div>

            <div className="mt-5 pt-4 border-t border-gray-200 dark:border-white/10 text-center">
              <p className="text-sm font-medium text-gray-400 mb-3">
                Or share via QR Code
              </p>
              <div className="bg-white p-2 rounded-xl inline-block shadow-lg mx-auto">
                <img
                  src={handleShare(shareFile.shortUrl).qr}
                  alt="QR Code"
                  className="w-24 h-24 rounded-lg"
                />
              </div>
              <div className="flex flex-row justify-center gap-3 mt-4">
                <button
                  onClick={() => downloadQRCode(shareFile.shortUrl)}
                  className="flex-1 inline-flex justify-center items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white rounded-xl transition-all"
                >
                  <FaDownload className="text-blue-400 text-lg" />
                  <span className="font-medium text-sm">Save QR</span>
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      handleShare(shareFile.shortUrl).copy
                    );
                    toast.success("Link copied to clipboard!");
                  }}
                  className="flex-1 inline-flex justify-center items-center gap-2 px-4 py-2.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-white rounded-xl transition-all"
                >
                  <FaShare className="text-blue-400 text-lg" />
                  <span className="font-medium text-sm">Copy Link</span>
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default GuestFilePreview;
