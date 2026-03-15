export default function FloatingLogo() {
  return (
    <div className="flex justify-center mb-10 animate-float">

      <div className="flex items-center gap-3 bg-white/70 backdrop-blur-md px-6 py-3 rounded-xl shadow-lg border">

        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
          ⚡
        </div>

        <span className="text-lg font-semibold text-gray-800">
          Prompt2Deploy
        </span>

      </div>

    </div>
  );
}