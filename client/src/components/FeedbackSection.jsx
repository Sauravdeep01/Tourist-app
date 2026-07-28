import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import StarRating from './StarRating';
import {
  Quote,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Send,
  Pencil,
  Trash2,
  User,
  ShieldCheck,
  X,
} from 'lucide-react';

const FEATURED_LIMIT = 6;

// Home page testimonials section — public rating summary, latest reviews, and the
// logged-in tourist's own submit/edit/delete controls, all in one self-contained block.
export default function FeedbackSection() {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const { user } = useContext(AuthContext);

  const [feedbacks, setFeedbacks] = useState([]);
  const [loadingFeed, setLoadingFeed] = useState(true);
  const [stats, setStats] = useState({ average: 0, total: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } });

  const [myFeedback, setMyFeedback] = useState(null);
  const [loadingMine, setLoadingMine] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formRating, setFormRating] = useState(5);
  const [formComment, setFormComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

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
      setFormRating(data.rating);
      setFormComment(data.comment);
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
    setIsEditing(true);
    setFormError('');
    setFormSuccess('');
  };

  const startEditReview = () => {
    setFormRating(myFeedback.rating);
    setFormComment(myFeedback.comment);
    setIsEditing(true);
    setFormError('');
    setFormSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!formComment.trim()) {
      setFormError(lang === 'zh' ? '请填写您的评价内容' : 'Please share a few words about your experience.');
      return;
    }

    try {
      setSubmitting(true);
      let data;
      if (myFeedback) {
        ({ data } = await api.patch('/api/feedback/mine', { rating: formRating, comment: formComment.trim() }));
      } else {
        ({ data } = await api.post('/api/feedback', { rating: formRating, comment: formComment.trim() }));
      }
      setMyFeedback(data);
      setIsEditing(false);
      setFormSuccess(
        lang === 'zh' ? '感谢您的分享！您的评价已提交。' : 'Thank you for sharing! Your feedback has been saved.'
      );
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

  const handleDelete = async () => {
    if (!window.confirm(lang === 'zh' ? '确定要删除您的评价吗？' : 'Delete your feedback? This cannot be undone.')) {
      return;
    }
    try {
      setDeleting(true);
      await api.delete('/api/feedback/mine');
      setMyFeedback(null);
      setIsEditing(false);
      setFormSuccess(lang === 'zh' ? '您的评价已删除。' : 'Your feedback has been removed.');
      fetchStats();
      fetchFeed();
    } catch (err) {
      setFormError(err.response?.data?.error || (lang === 'zh' ? '删除失败，请重试。' : 'Failed to delete. Please try again.'));
    } finally {
      setDeleting(false);
    }
  };

  const distributionMax = Math.max(1, ...Object.values(stats.distribution || {}));

  return (
    <section className="py-20 bg-[#131b2e] border-y border-slate-800 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            {lang === 'zh' ? '朝圣者的真实心声' : 'What Our Pilgrims Say'}
          </h2>
          <p className="text-slate-400 leading-relaxed font-sans">
            {lang === 'zh'
              ? '每一段旅程都是一次心灵的洗礼，欢迎已注册的朝圣者留下您的评价。'
              : 'Every journey leaves a mark — registered pilgrims are welcome to share their experience.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Rating summary + submit/manage own review */}
          <div className="lg:col-span-1 space-y-6">
            {/* Stats card */}
            <div className="bg-[#161f30] rounded-2xl border border-slate-800 p-6 space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-5xl font-serif font-extrabold text-saffron-400">{stats.average.toFixed(1)}</span>
                <div>
                  <StarRating value={Math.round(stats.average)} size="sm" />
                  <p className="text-[11px] text-slate-400 mt-1">
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

              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = stats.distribution?.[star] || 0;
                  const widthPct = (count / distributionMax) * 100;
                  return (
                    <div key={star} className="flex items-center gap-2 text-[11px]">
                      <span className="w-7 text-slate-400 font-medium shrink-0">{star} ★</span>
                      <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-saffron-400 rounded-full transition-all duration-500"
                          style={{ width: `${count > 0 ? Math.max(widthPct, 4) : 0}%` }}
                        />
                      </div>
                      <span className="w-5 text-slate-500 text-right shrink-0">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Submit / manage own review */}
            {!user ? (
              <div className="bg-[#161f30] rounded-2xl border border-slate-800 p-6 text-center space-y-3">
                <User className="h-8 w-8 text-saffron-400 mx-auto" />
                <p className="text-sm text-slate-300 leading-relaxed">
                  {lang === 'zh'
                    ? '登录后分享您的朝圣体验'
                    : 'Log in to share your pilgrimage experience'}
                </p>
                <div className="flex flex-col gap-2 pt-1">
                  <Link
                    to="/signup?next=/"
                    className="inline-flex items-center justify-center bg-saffron-500 hover:bg-saffron-600 text-neutral-950 font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md"
                  >
                    {lang === 'zh' ? '注册账户' : 'Sign Up'}
                  </Link>
                  <Link
                    to="/login?next=/"
                    className="inline-flex items-center justify-center bg-[#192235] hover:bg-slate-800 border border-slate-700 text-saffron-400 font-semibold text-xs px-4 py-2.5 rounded-xl transition-all"
                  >
                    {lang === 'zh' ? '已有账号？登录' : 'Log In'}
                  </Link>
                </div>
              </div>
            ) : user.role !== 'user' ? (
              <div className="bg-[#161f30] rounded-2xl border border-slate-800 p-5 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                <ShieldCheck className="h-4 w-4 text-saffron-400 shrink-0" />
                <span>
                  {lang === 'zh'
                    ? '员工账户请通过管理后台管理评价。'
                    : 'Staff accounts manage reviews from the dashboard.'}
                </span>
              </div>
            ) : (
              <div className="bg-[#161f30] rounded-2xl border border-slate-800 p-6 space-y-4">
                {formSuccess && !isEditing && (
                  <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>{formSuccess}</span>
                  </div>
                )}

                {loadingMine ? (
                  <div className="py-4 flex items-center justify-center text-slate-400 space-x-2 text-xs">
                    <Loader2 className="h-4 w-4 animate-spin text-saffron-400" />
                    <span>{lang === 'zh' ? '加载中...' : 'Loading...'}</span>
                  </div>
                ) : !isEditing && myFeedback ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <StarRating value={myFeedback.rating} size="sm" />
                      <span className="text-[10px] text-slate-500">
                        {new Date(myFeedback.updatedAt || myFeedback.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-4 whitespace-pre-line">
                      {myFeedback.comment}
                    </p>
                    <div className="flex gap-2 pt-2 border-t border-slate-800">
                      <button
                        onClick={startEditReview}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-semibold transition-colors cursor-pointer"
                      >
                        <Pencil className="h-3 w-3" />
                        <span>{lang === 'zh' ? '编辑' : 'Edit'}</span>
                      </button>
                      <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/60 border border-red-800 text-red-300 text-[11px] font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>{lang === 'zh' ? '删除' : 'Delete'}</span>
                      </button>
                    </div>
                  </div>
                ) : !isEditing ? (
                  <button
                    onClick={startNewReview}
                    className="w-full inline-flex items-center justify-center gap-2 bg-saffron-500 hover:bg-saffron-600 text-neutral-950 font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    <span>{lang === 'zh' ? '撰写评价' : 'Write a Review'}</span>
                  </button>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    {formError && (
                      <div className="p-3 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
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
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-700 bg-[#192235] text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-saffron-400 transition-all"
                    />

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 bg-saffron-500 hover:bg-saffron-600 active:scale-95 text-neutral-950 font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md disabled:opacity-50 cursor-pointer"
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
                          setIsEditing(false);
                          setFormError('');
                        }}
                        className="inline-flex items-center justify-center gap-1.5 bg-[#192235] hover:bg-slate-800 border border-slate-700 text-slate-300 font-semibold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer"
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
              <div className="h-full min-h-[240px] flex items-center justify-center text-slate-400 space-x-2 text-xs">
                <Loader2 className="h-6 w-6 animate-spin text-saffron-400" />
                <span>{lang === 'zh' ? '加载评价中...' : 'Loading reviews...'}</span>
              </div>
            ) : feedbacks.length === 0 ? (
              <div className="h-full min-h-[240px] flex flex-col items-center justify-center text-center text-slate-400 text-sm bg-[#161f30] rounded-2xl border border-slate-800 p-8">
                <Quote className="h-8 w-8 text-slate-600 mb-2" />
                {lang === 'zh' ? '暂无评价，成为第一位分享心声的朝圣者吧！' : 'No reviews yet — be the first pilgrim to share your story!'}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {feedbacks.map((fb) => (
                  <div
                    key={fb._id}
                    className="bg-[#161f30] rounded-2xl border border-slate-800 p-5 space-y-2.5 hover:border-saffron-400/50 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-saffron-500/20 border border-saffron-500/30 flex items-center justify-center text-saffron-400 font-bold text-xs shrink-0">
                          {fb.user?.name?.charAt(0)?.toUpperCase() || 'P'}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-white">
                            {fb.user?.name || (lang === 'zh' ? '朝圣者' : 'Pilgrim')}
                          </p>
                          <p className="text-[10px] text-slate-500">{new Date(fb.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <StarRating value={fb.rating} size="sm" />
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 whitespace-pre-line">
                      <Quote className="h-3 w-3 text-slate-600 inline mr-1 -translate-y-0.5" />
                      {fb.comment}
                    </p>

                    {fb.reply?.text && (
                      <div className="pl-3 border-l-2 border-saffron-500/50 bg-saffron-500/5 rounded-r-lg p-2">
                        <p className="text-[9px] font-bold text-saffron-400 uppercase tracking-wide mb-0.5">
                          {lang === 'zh' ? '官方回复' : 'Our Reply'}
                        </p>
                        <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2">{fb.reply.text}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
