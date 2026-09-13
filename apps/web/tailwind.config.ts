import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./app/**/*.{ts,tsx}','./components/**/*.{ts,tsx}'],
  theme: { extend: {
    colors: { primary:'#0A2463', bg:'#F8F9FA', bgDark:'#000000', text:'#212529',
      ctaAccept:'#00E676', ctaAlert:'#FF5722', border:'#DEE2E6', muted:'#6C757D' },
    fontFamily: { sans:['Inter','system-ui','sans-serif'] },
    borderRadius: { md:'10px', lg:'16px' },
  }},
  plugins: [],
};
export default config;
