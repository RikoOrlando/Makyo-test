import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import postcss from "rollup-plugin-postcss";
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";
export default {
  input: "src/components/index.ts",
  output: [
    {
      file: "dist/index.js",
      format: "cjs",
    },
    {
      file: "dist/index.js", // ES module build
      format: "es",
      sourcemap: true,
    },
  ],
  plugins: [
    babel({
      presets: ["@babel/preset-env", "@babel/preset-react"],
      exclude: "node_modules/**",
    }),
    typescript({ tsconfig: "./tsconfig.json" }),
    commonjs(),
    resolve(),
    postcss({
      modules: true,
    }),
    terser(),
  ],
  external: ["react", "react-dom"],
};
