# 🎨 ConvertCast Brand Guidelines

## 📋 **Overview**

ConvertCast brand guidelines based on the Mystic Lab design system - a modern, professional, and conversion-focused aesthetic for live streaming platforms.

---

## 🎨 **Color Palette**

### **Primary Colors**
```css
--primary: 274 100% 55%           /* Purple #8B5CF6 */
--primary-foreground: 274 100% 97% /* Light Purple #FEFCFF */
```

### **Background Colors**
```css
--background: 222.2 84% 4.9%      /* Dark Slate #0F172A */
--foreground: 210 40% 98%         /* Light Gray #F8FAFC */
--card: 222.2 84% 4.9%           /* Dark Slate #0F172A */
--card-foreground: 210 40% 98%    /* Light Gray #F8FAFC */
```

### **Accent Colors**
```css
--secondary: 217.2 32.6% 17.5%    /* Dark Blue-Gray #1E293B */
--accent: 217.2 32.6% 17.5%       /* Dark Blue-Gray #1E293B */
--muted: 217.2 32.6% 17.5%        /* Dark Blue-Gray #1E293B */
--destructive: 0 62.8% 30.6%      /* Red #DC2626 */
```

### **Purple Scale**
```css
50:  hsl(274 100% 97%)  /* #FEFCFF */
100: hsl(274 100% 94%)  /* #FDEBFF */
200: hsl(274 100% 87%)  /* #F9D5FF */
300: hsl(274 100% 77%)  /* #F3B4FF */
400: hsl(274 100% 66%)  /* #E879F9 */
500: hsl(274 100% 55%)  /* #D946EF */
600: hsl(274 100% 44%)  /* #C026D3 */
700: hsl(274 100% 33%)  /* #A21CAF */
800: hsl(274 100% 22%)  /* #86198F */
900: hsl(274 100% 11%)  /* #701A75 */
950: hsl(274 100% 6%)   /* #4A044E */
```

### **Sidebar Colors**
```css
--sidebar-background: 240 5.9% 10%     /* #0F172A */
--sidebar-foreground: 240 4.8% 95.9%   /* #F1F5F9 */
--sidebar-primary: 224.3 76.3% 48%     /* #3B82F6 */
--sidebar-accent: 240 3.7% 15.9%       /* #1E293B */
--sidebar-border: 240 3.7% 15.9%       /* #1E293B */
```

---

## 🎯 **Typography**

### **Font Hierarchy**
- **Primary Font**: System fonts (optimized for performance)
- **Font Smoothing**: Antialiased for crisp rendering
- **Text Rendering**: Optimized for legibility

### **Heading Sizes**
```css
h1: text-3xl sm:text-4xl lg:text-7xl  /* 48px-112px */
h2: text-2xl sm:text-3xl lg:text-4xl  /* 32px-56px */
h3: text-xl sm:text-2xl               /* 20px-32px */
h4: text-lg sm:text-xl                /* 18px-24px */
h5: text-base sm:text-lg              /* 16px-20px */
h6: text-sm sm:text-base              /* 14px-16px */
```

### **Text Styles**
- **Body Text**: `text-xl text-white/80` (Large, readable)
- **Muted Text**: `text-white/60` or `text-gray-400`
- **Accent Text**: `text-purple-400` or `text-blue-400`
- **Success Text**: `text-green-400`
- **Error Text**: `text-red-400`

---

## 🖼️ **Layout Principles**

### **Grid System**
- **Container**: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- **Grid**: `lg:grid lg:grid-cols-2 lg:gap-16`
- **Responsive**: Mobile-first approach

### **Spacing Scale**
- **Micro**: `gap-1` (4px)
- **Small**: `gap-2` (8px)
- **Medium**: `gap-4` (16px)
- **Large**: `gap-8` (32px)
- **XLarge**: `gap-16` (64px)

### **Border Radius**
```css
--radius: 0.5rem                /* 8px */
lg: var(--radius)               /* 8px */
md: calc(var(--radius) - 2px)  /* 6px */
sm: calc(var(--radius) - 4px)  /* 4px */
```

---

## 🎭 **Visual Effects**

### **Gradients**
```css
/* Hero Background */
bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900

/* Text Gradients */
bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent

/* Card Gradients */
bg-gradient-to-r from-blue-500 to-cyan-500
bg-gradient-to-r from-purple-500 to-pink-500
bg-gradient-to-r from-green-500 to-emerald-500
bg-gradient-to-r from-orange-500 to-red-500
```

### **Blur Effects**
```css
/* Background Orbs */
bg-purple-500/10 rounded-full blur-3xl
bg-blue-500/10 rounded-full blur-3xl

/* Backdrop Blur */
backdrop-blur-sm
```

### **Shadows**
```css
/* Card Shadows */
shadow-lg
shadow-2xl

/* Glow Effects */
shadow-purple-500/25
shadow-blue-500/25
```

---

## 🎬 **Animation Guidelines**

### **Page Transitions**
```css
/* Fade In/Out */
initial: { opacity: 0, y: 20 }
animate: { opacity: 1, y: 0 }
exit: { opacity: 0, y: -20 }

/* Duration */
duration: 0.4s
ease: "anticipate"
```

### **Micro Animations**
```css
/* Hover States */
hover:scale-105
hover:shadow-lg
transition-all duration-200

/* Button Hover */
hover:bg-purple-600
hover:shadow-purple-500/25
```

### **Rotating Text Animation**
```css
@keyframes rotatingTextFade {
  0%, 25% { opacity: 1; }
  33.33%, 100% { opacity: 0; }
}
```

---

## 🧩 **Component Patterns**

### **Cards**
```tsx
<Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
  <CardHeader>
    <CardTitle className="text-white">Title</CardTitle>
    <CardDescription className="text-white/80">Description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

### **Buttons**
```tsx
/* Primary Button */
<Button className="bg-purple-600 hover:bg-purple-700 text-white">
  Action
</Button>

/* Secondary Button */
<Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-500/10">
  Secondary
</Button>
```

### **Stats Cards**
```tsx
<Card className="p-6 bg-gradient-to-r from-blue-500 to-cyan-500">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-blue-100">Metric Name</p>
      <p className="text-3xl font-bold text-white">Value</p>
    </div>
    <Icon className="w-8 h-8 text-blue-200" />
  </div>
</Card>
```

---

## 📱 **Responsive Design**

### **Breakpoints**
```css
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
2xl: 1400px /* Container max-width */
```

### **Mobile Optimizations**
- **Font Size**: Minimum 16px to prevent zoom
- **Touch Targets**: Minimum 44px height
- **Font Smoothing**: Antialiased for high DPI displays
- **Performance**: Transform3d for hardware acceleration

---

## 🎨 **Dark Mode Theme**

### **Background Hierarchy**
1. **Primary Background**: `bg-slate-950` (#020617)
2. **Card Background**: `bg-slate-900` (#0F172A)
3. **Elevated Background**: `bg-slate-800` (#1E293B)
4. **Interactive Background**: `bg-slate-700` (#334155)

### **Text Hierarchy**
1. **Primary Text**: `text-white` (100% opacity)
2. **Secondary Text**: `text-white/80` (80% opacity)
3. **Muted Text**: `text-white/60` (60% opacity)
4. **Disabled Text**: `text-white/40` (40% opacity)

---

## 🚀 **Usage Guidelines**

### **Do's**
✅ Use consistent spacing (4px, 8px, 16px, 32px, 64px)
✅ Maintain proper contrast ratios for accessibility
✅ Use gradients sparingly for emphasis
✅ Implement smooth transitions for better UX
✅ Optimize for mobile-first responsive design

### **Don'ts**
❌ Mix different border radius values inconsistently
❌ Use too many colors in a single interface
❌ Ignore hover and focus states
❌ Use animations longer than 0.5 seconds
❌ Create interfaces without proper visual hierarchy

---

## 🔧 **Implementation**

### **CSS Variables Setup**
```css
:root {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 274 100% 55%;
  --primary-foreground: 274 100% 97%;
  /* ... other variables */
}
```

### **Tailwind Integration**
```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // ... other colors
      }
    }
  }
}
```

---

## 📊 **Performance Guidelines**

### **Font Optimization**
```css
body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}
```

### **Hardware Acceleration**
```css
* {
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  -webkit-transform: translate3d(0,0,0);
  transform: translate3d(0,0,0);
}
```

---

**Last Updated**: January 2025
**Version**: 1.0
**Created for**: ConvertCast Platform