import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import StarRating from './StarRating';
import Toast from './Toast';
import ConfirmDialog from './ConfirmDialog';
import ScrollReveal from './Decor/ScrollReveal';
import Watermark from './Decor/Watermark';
import {
  Quote,
  Loader2,
  AlertCircle,
  Send,
  MoreVertical,
  Trash2,
  User,
  ShieldCheck,
  X,
} from 'lucide-react';

const FEATURED_LIMIT = 6;

// Home page testimonials section — public rating summary, latest reviews, and the
// logged-in tourist's own submit/delete controls, all in one self-contained block.
export default function FeedbackSection() {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const { user } = useContext(AuthContext);

  const [feedbacks, setFeedbacks] = useState([]);
  const [loadingFeed, setLoadingFeed] = useState(true);
  const [stats, setStats] = useState({ average: 0, total: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } });

  const [myFeedback, setMyFeedback] = useState(null);
  const [loadingMine, setLoadingMine] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formRating, setFormRating] = useState(5);
  const [formComment, setFormComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formError, setFormError] = useState('');

  const [toast, setToast] = useState(null); // { message, type }
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const showToast = (message, type = 'success') => setToast({ message, type });

  // Close the own-review dropdown menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await api.get('/api/feedback/stats');
      setStats(data);
    } catch (err) {
      console.error('Failed to load feedback stats:', err);
    }
  }, []);

  const fetchFeed = useCallback(async () => {
    setLoadingFeed(true);
    try {
      const { data } = await api.get('/api/feedback', { params: { page: 1, limit: FEATURED_LIMIT } });
      setFeedbacks(data.feedbacks || []);
    } catch (err) {
      console.error('Failed to load feedback feed:', err);
    } finally {
      setLoadingFeed(false);
    }
  }, []);

  const fetchMine = useCallback(async () => {
    setLoadingMine(true);
    try {
      const { data } = await api.get('/api/feedback/mine');
      setMyFeedback(data);
    } catch (err) {
      if (err.response?.status !== 404) {
        console.error('Failed to load your feedback:', err);
      }
      setMyFeedback(null);
    } finally {
      setLoadingMine(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchFeed();
  }, [fetchStats, fetchFeed]);

  useEffect(() => {
    if (user?.role === 'user') {
      fetchMine();
    }
  }, [user, fetchMine]);

  const startNewReview = () => {
    setFormRating(5);
    setFormComment('');
    setShowForm(true);
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formComment.trim()) {
      setFormError(lang === 'zh' ? '请填写您的评价内容' : 'Please share a few words about your experience.');
      return;
    }

    try {
      setSubmitting(true);
      const { data } = await api.post('/api/feedback', { rating: formRating, comment: formComment.trim() });
      setMyFeedback(data);
      setShowForm(false);
      showToast(lang === 'zh' ? '感谢您提交的评价！' : 'Thanks for submitting your feedback!');
      fetchStats();
      fetchFeed();
    } catch (err) {
      console.error('Feedback submit error:', err);
      const msg =
        err.response?.data?.errors?.[0]?.message ||
        err.response?.data?.error ||
        (lang === 'zh' ? '提交失败，请重试。' : 'Submission failed. Please try again.');
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const requestDelete = () => {
    setMenuOpen(false);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleting(true);
      await api.delete('/api/feedback/mine');
      setMyFeedback(null);
      setConfirmOpen(false);
      showToast(lang === 'zh' ? '评价已成功删除。' : 'Feedback deleted successfully.');
      fetchStats();
      fetchFeed();
    } catch (err) {
      setConfirmOpen(false);
      showToast(
        err.response?.data?.error || (lang === 'zh' ? '删除失败，请重试。' : 'Failed to delete. Please try again.'),
        'error'
      );
    } finally {
      setDeleting(false);
    }
  };

  const distributionMax = Math.max(1, ...Object.values(stats.distribution || {}));

  return (
    <section className="relative overflow-hidden py-24 sm:py-28 bg-ivory border-y border-card-border text-heading font-sans">
      <Watermark variant="lotus" size={360} className="-top-14 -left-14 hidden lg:block" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <ScrollReveal className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-heading mb-4">
            {lang === 'zh' ? '朝圣者的真实心声' : 'What Our Pilgrims Say'}
          </h2>
          <p className="text-body leading-relaxed font-sans">
            {lang === 'zh'
              ? '每一段旅程都是一次心灵的洗礼，欢迎已注册的朝圣者留下您的评价。'
              : 'Every journey leaves a mark — registered pilgrims are welcome to share their experience.'}
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Rating summary + submit own review */}
          <div className="lg:col-span-1 space-y-6">
            {/* Stats card */}
            <div className="premium-card p-8 space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-5xl font-serif font-extrabold text-maroon-700">{stats.average.toFixed(1)}</span>
                <div>
                  <StarRating value={Math.round(stats.average)} size="sm" />
                  <p className="text-[11px] text-body mt-1">
                    {stats.total === 0
                      ? lang === 'zh'
                        ? '暂无评价'
                        : 'No reviews yet'
                      : lang === 'zh'
                      ? `基于 ${stats.total} 条评价`
                      : `Based on ${stats.total} review${stats.total === 1 ? '' : 's'}`}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-card-border">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = stats.distribution?.[star] || 0;
                  const widthPct = (count / distributionMax) * 100;
                  return (
                    <div key={star} className="flex items-center gap-2 text-[11px]">
                      <span className="w-7 text-body font-medium shrink-0">{star} ★</span>
                      <div className="flex-1 h-1.5 rounded-full bg-beige overflow-hidden">
                        <div
                          className="h-full bg-saffron-500 rounded-full transition-all duration-500"
                          style={{ width: `${count > 0 ? Math.max(widthPct, 4) : 0}%` }}
                        />
                      </div>
                      <span className="w-5 text-muted text-right shrink-0">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Submit / status of own review */}
            {!user ? (
              <div className="premium-card p-8 text-center space-y-3">
                <User className="h-8 w-8 text-saffron-500 mx-auto" />
                <p className="text-sm text-body leading-relaxed">
                  {lang === 'zh'
                    ? '登录后分享您的朝圣体验'
                    : 'Log in to share your pilgrimage experience'}
                </p>
                <div className="flex flex-col gap-2 pt-1">
                  <Link
                    to="/signup?next=/"
                    className="inline-flex items-center justify-center bg-maroon-700 hover:bg-maroon-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-[#9F2845] transition-all shadow-md"
                  >
                    {lang === 'zh' ? '注册账户' : 'Sign Up'}
                  </Link>
                  <Link
                    to="/login?next=/"
                    className="inline-flex items-center justify-center bg-ivory hover:bg-beige border border-card-border text-heading font-semibold text-xs px-4 py-2.5 rounded-xl transition-all"
                  >
                    {lang === 'zh' ? '已有账号？登录' : 'Log In'}
                  </Link>
                </div>
              </div>
            ) : user.role !== 'user' ? (
              <div className="premium-card p-5 text-center text-xs text-body flex items-center justify-center gap-2">
                <ShieldCheck className="h-4 w-4 text-saffron-500 shrink-0" />
                <span>
                  {lang === 'zh'
                    ? '员工账户请通过管理后台管理评价。'
                    : 'Staff accounts manage reviews from the dashboard.'}
                </span>
              </div>
            ) : loadingMine ? (
              <div className="premium-card p-8">
                <div className="py-4 flex items-center justify-center text-body space-x-2 text-xs">
                  <Loader2 className="h-4 w-4 animate-spin text-saffron-500" />
                  <span>{lang === 'zh' ? '加载中...' : 'Loading...'}</span>
                </div>
              </div>
            ) : myFeedback && !showForm ? null : (
              <div className="premium-card p-8 space-y-4">
                {!showForm ? (
                  <button
                    onClick={startNewReview}
                    className="w-full inline-flex items-center justify-center gap-2 bg-maroon-700 hover:bg-maroon-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-[#9F2845] transition-all shadow-md cursor-pointer"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>{lang === 'zh' ? '撰写评价' : 'Write a Review'}</span>
                  </button>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    {formError && (
                      <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                        <span>{formError}</span>
                      </div>
                    )}

                    <StarRating value={formRating} onChange={setFormRating} size="md" />

                    <textarea
                      rows="3"
                      maxLength={1000}
                      value={formComment}
                      onChange={(e) => setFormComment(e.target.value)}
                      placeholder={
                        lang === 'zh' ? '分享您此次朝圣之旅的感受...' : 'Tell us about your experience...'
                      }
                      className="w-full px-3 py-2.5 rounded-xl border border-card-border bg-[#F9F7F2] text-xs text-heading placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-maroon-700/30 transition-all"
                    />

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 bg-maroon-700 hover:bg-maroon-800 active:scale-95 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-[#9F2845] transition-all shadow-md disabled:opacity-50 cursor-pointer"
                      >
                        {submitting ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Send className="h-3.5 w-3.5" />
                        )}
                        <span>{lang === 'zh' ? '提交' : 'Submit'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowForm(false);
                          setFormError('');
                        }}
                        className="inline-flex items-center justify-center gap-1.5 bg-beige hover:bg-card-border border border-card-border text-heading font-semibold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Latest reviews grid */}
          <div className="lg:col-span-2">
            {loadingFeed ? (
              <div className="h-full min-h-60 flex items-center justify-center text-body space-x-2 text-xs">
                <Loader2 className="h-6 w-6 animate-spin text-saffron-500" />
                <span>{lang === 'zh' ? '加载评价中...' : 'Loading reviews...'}</span>
              </div>
            ) : feedbacks.length === 0 ? (
              <div className="premium-card h-full min-h-60 flex flex-col items-center justify-center text-center text-body text-sm p-8">
                <Quote className="h-8 w-8 text-muted mb-2" />
                {lang === 'zh' ? '暂无评价，成为第一位分享心声的朝圣者吧！' : 'No reviews yet — be the first pilgrim to share your story!'}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {feedbacks.map((fb) => {
                  const isOwn = myFeedback && fb._id === myFeedback._id;
                  return (
                    <div key={fb._id} className="premium-card relative p-6 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-full bg-maroon-700 border border-saffron-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
                            {fb.user?.name?.charAt(0)?.toUpperCase() || 'P'}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-heading">
                              {fb.user?.name || (lang === 'zh' ? '朝圣者' : 'Pilgrim')}
                              {isOwn && (
                                <span className="ml-1.5 text-[9px] font-bold text-maroon-700 bg-maroon-700/10 border border-maroon-700/20 rounded px-1.5 py-0.5 align-middle">
                                  {lang === 'zh' ? '您' : 'You'}
                                </span>
                              )}
                            </p>
                            <p className="text-[10px] text-muted">{new Date(fb.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <StarRating value={fb.rating} size="sm" />

                          {isOwn && (
                            <div className="relative" ref={menuRef}>
                              <button
                                type="button"
                                onClick={() => setMenuOpen((o) => !o)}
                                className="p-1 rounded-lg text-muted hover:text-heading hover:bg-beige transition-colors cursor-pointer"
                                aria-label={lang === 'zh' ? '更多操作' : 'More options'}
                                aria-haspopup="true"
                                aria-expanded={menuOpen}
                              >
                                <MoreVertical className="h-4 w-4" />
                              </button>

                              {menuOpen && (
                                <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-card-border rounded-xl shadow-xl py-1 z-20 animate-in fade-in zoom-in-95 duration-100">
                                  <button
                                    type="button"
                                    onClick={requestDelete}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                    <span>{lang === 'zh' ? '删除' : 'Delete'}</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-body leading-relaxed line-clamp-3 whitespace-pre-line font-sans">
                        <Quote className="h-3 w-3 text-saffron-500 inline mr-1 -translate-y-0.5" />
                        {fb.comment}
                      </p>

                      {fb.reply?.text && (
                        <div className="pl-3 border-l-2 border-maroon-700 bg-maroon-700/5 rounded-r-xl p-2.5">
                          <p className="text-[9px] font-bold text-maroon-700 uppercase tracking-wide mb-0.5">
                            {lang === 'zh' ? '官方回复' : 'Our Reply'}
                          </p>
                          <p className="text-[11px] text-body leading-relaxed line-clamp-2">{fb.reply.text}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title={lang === 'zh' ? '删除评价' : 'Delete feedback'}
        message={
          lang === 'zh'
            ? '确定要删除您的评价吗？此操作无法撤销。'
            : 'Are you sure you want to delete your feedback? This action cannot be undone.'
        }
        confirmLabel={lang === 'zh' ? '删除' : 'Delete'}
        cancelLabel={lang === 'zh' ? '取消' : 'Cancel'}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
        loading={deleting}
      />

      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
    </section>
  );
}
