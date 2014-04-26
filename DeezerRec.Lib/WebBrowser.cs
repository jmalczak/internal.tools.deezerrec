using System;
using System.Runtime.InteropServices;
using FILETIME = System.Runtime.InteropServices.ComTypes.FILETIME;

namespace DeezerRec.Lib
{
    public static class WebBrowserClearCache
    {
        [DllImport("wininet", CharSet = CharSet.Auto, CallingConvention = CallingConvention.StdCall, SetLastError = true)]
        public static extern IntPtr FindFirstUrlCacheGroup(int dwFlags, int dwFilter, IntPtr lpSearchCondition, int dwSearchCondition, ref long lpGroupId, IntPtr lpReserved);

        [DllImport("wininet", CharSet = CharSet.Auto, CallingConvention = CallingConvention.StdCall, SetLastError = true)]
        public static extern bool FindNextUrlCacheGroup(IntPtr hFind, ref long lpGroupId, IntPtr lpReserved);

        [DllImport("wininet", CharSet = CharSet.Auto, CallingConvention = CallingConvention.StdCall, SetLastError = true)]
        public static extern bool DeleteUrlCacheGroup(long GroupId, int dwFlags, IntPtr lpReserved);

        [DllImport("wininet", EntryPoint = "FindFirstUrlCacheEntryA", CharSet = CharSet.Auto, CallingConvention = CallingConvention.StdCall, SetLastError = true)]
        public static extern IntPtr FindFirstUrlCacheEntry([MarshalAs(UnmanagedType.LPTStr)] string lpszUrlSearchPattern, IntPtr lpFirstCacheEntryInfo, ref int lpdwFirstCacheEntryInfoBufferSize);

        [DllImport("wininet", EntryPoint = "FindNextUrlCacheEntryA", CharSet = CharSet.Auto, CallingConvention = CallingConvention.StdCall, SetLastError = true)]
        public static extern bool FindNextUrlCacheEntry(IntPtr hFind, IntPtr lpNextCacheEntryInfo, ref int lpdwNextCacheEntryInfoBufferSize);

        [DllImport("wininet", EntryPoint = "DeleteUrlCacheEntryA", CharSet = CharSet.Auto, CallingConvention = CallingConvention.StdCall, SetLastError = true)]
        public static extern bool DeleteUrlCacheEntry(IntPtr lpszUrlName);

        [STAThread]
        public static void Clear()
        {
            long lpGroupId = 0L;
            int num1 = 0;
            IntPtr num2 = IntPtr.Zero;
            IntPtr num3 = IntPtr.Zero;
            bool flag1 = false;
            IntPtr firstUrlCacheGroup = WebBrowserClearCache.FindFirstUrlCacheGroup(0, 0, IntPtr.Zero, 0, ref lpGroupId, IntPtr.Zero);
            if (firstUrlCacheGroup != IntPtr.Zero && 259 == Marshal.GetLastWin32Error())
                return;
            bool flag2;
            do
            {
                flag2 = WebBrowserClearCache.DeleteUrlCacheGroup(lpGroupId, 2, IntPtr.Zero);
                if (!flag2 && 2 == Marshal.GetLastWin32Error())
                    flag2 = WebBrowserClearCache.FindNextUrlCacheGroup(firstUrlCacheGroup, ref lpGroupId, IntPtr.Zero);
            }
            while ((flag2 || 259 != Marshal.GetLastWin32Error() && 2 != Marshal.GetLastWin32Error()) && !flag2);
            if (WebBrowserClearCache.FindFirstUrlCacheEntry((string)null, IntPtr.Zero, ref num1) == IntPtr.Zero && 259 == Marshal.GetLastWin32Error())
                return;
            int cb = num1;
            IntPtr num4 = Marshal.AllocHGlobal(cb);
            IntPtr firstUrlCacheEntry = WebBrowserClearCache.FindFirstUrlCacheEntry((string)null, num4, ref num1);
            while (true)
            {
                bool flag3;
                do
                {
                    WebBrowserClearCache.INTERNET_CACHE_ENTRY_INFOA internetCacheEntryInfoa = (WebBrowserClearCache.INTERNET_CACHE_ENTRY_INFOA)Marshal.PtrToStructure(num4, typeof(WebBrowserClearCache.INTERNET_CACHE_ENTRY_INFOA));
                    num1 = cb;
                    flag3 = WebBrowserClearCache.DeleteUrlCacheEntry(internetCacheEntryInfoa.lpszSourceUrlName);
                    if (!flag3)
                        flag3 = WebBrowserClearCache.FindNextUrlCacheEntry(firstUrlCacheEntry, num4, ref num1);
                    if (!flag3 && 259 == Marshal.GetLastWin32Error())
                        goto label_12;
                }
                while (flag3 || num1 <= cb);
                cb = num1;
                num4 = Marshal.ReAllocHGlobal(num4, (IntPtr)cb);
                flag1 = WebBrowserClearCache.FindNextUrlCacheEntry(firstUrlCacheEntry, num4, ref num1);
            }
        label_12:
            Marshal.FreeHGlobal(num4);
        }

        [StructLayout(LayoutKind.Explicit, Size = 80)]
        public struct INTERNET_CACHE_ENTRY_INFOA
        {
            [FieldOffset(0)]
            public uint dwStructSize;
            [FieldOffset(4)]
            public IntPtr lpszSourceUrlName;
            [FieldOffset(8)]
            public IntPtr lpszLocalFileName;
            [FieldOffset(12)]
            public uint CacheEntryType;
            [FieldOffset(16)]
            public uint dwUseCount;
            [FieldOffset(20)]
            public uint dwHitRate;
            [FieldOffset(24)]
            public uint dwSizeLow;
            [FieldOffset(28)]
            public uint dwSizeHigh;
            [FieldOffset(32)]
            public FILETIME LastModifiedTime;
            [FieldOffset(40)]
            public FILETIME ExpireTime;
            [FieldOffset(48)]
            public FILETIME LastAccessTime;
            [FieldOffset(56)]
            public FILETIME LastSyncTime;
            [FieldOffset(64)]
            public IntPtr lpHeaderInfo;
            [FieldOffset(68)]
            public uint dwHeaderInfoSize;
            [FieldOffset(72)]
            public IntPtr lpszFileExtension;
            [FieldOffset(76)]
            public uint dwReserved;
            [FieldOffset(76)]
            public uint dwExemptDelta;
        }
    }
}
