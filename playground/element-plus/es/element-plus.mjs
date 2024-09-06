import "element-plus/theme-chalk/el-button.css";
import "element-plus/theme-chalk/base.css";
import { defineComponent as l, openBlock as p, createElementBlock as f, Fragment as d, createVNode as e, unref as n, withCtx as r, createTextVNode as o } from "vue";
import { ElButton as u } from "element-plus";
const y = /* @__PURE__ */ l({
  __name: "App",
  setup(m) {
    return (a, t) => (p(), f(d, null, [
      e(n(u), null, {
        default: r(() => t[0] || (t[0] = [
          o("Default")
        ])),
        _: 1
      }),
      e(n(u), { type: "primary" }, {
        default: r(() => t[1] || (t[1] = [
          o("Primary")
        ])),
        _: 1
      }),
      e(n(u), { type: "success" }, {
        default: r(() => t[2] || (t[2] = [
          o("Success")
        ])),
        _: 1
      }),
      e(n(u), { type: "info" }, {
        default: r(() => t[3] || (t[3] = [
          o("Info")
        ])),
        _: 1
      }),
      e(n(u), { type: "warning" }, {
        default: r(() => t[4] || (t[4] = [
          o("Warning")
        ])),
        _: 1
      }),
      e(n(u), { type: "danger" }, {
        default: r(() => t[5] || (t[5] = [
          o("Danger")
        ])),
        _: 1
      })
    ], 64));
  }
});
export {
  y as default
};
