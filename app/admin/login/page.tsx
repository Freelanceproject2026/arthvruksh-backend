// 'use client';

// import { FormEvent, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { adminApi } from '@/lib/adminApi';

// export default function AdminLoginPage() {
//   const router = useRouter();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       await adminApi('/admin/login', {
//         method: 'POST',
//         body: JSON.stringify({ email, password }),
//       });

//       router.replace('/admin/dashboard');
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Unable to sign in');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.18),_transparent_40%),linear-gradient(135deg,_#020617,_#0f172a)] px-4 py-10 text-slate-100">
//       <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/50 backdrop-blur">
//         <div className="mb-8 text-center">
//           <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-400">Arthvruksh</p>
//           <h1 className="mt-3 text-3xl font-semibold text-white">Admin Access</h1>
//           <p className="mt-2 text-sm text-slate-400">Sign in to manage users, assessments, and system activity.</p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="mb-2 block text-sm font-medium text-slate-300" htmlFor="email">
//               Email
//             </label>
//             <input
//               id="email"
//               type="email"
//               value={email}
//               onChange={(event) => setEmail(event.target.value)}
//               required
//               className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none ring-0 transition focus:border-cyan-500"
//               placeholder="admin@example.com"
//             />
//           </div>

//           <div>
//             <label className="mb-2 block text-sm font-medium text-slate-300" htmlFor="password">
//               Password
//             </label>
//             <input
//               id="password"
//               type="password"
//               value={password}
//               onChange={(event) => setPassword(event.target.value)}
//               required
//               className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-500"
//               placeholder="Enter password"
//             />
//           </div>

//           {error ? <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div> : null}

//           <button
//             type="submit"
//             disabled={loading}
//             className="flex w-full items-center justify-center rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
//           >
//             {loading ? 'Signing in...' : 'Login'}
//           </button>
//         </form>
//       </div>
//     </main>
//   );
// }
