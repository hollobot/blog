export const myCustomDirective = {
  // 这里填写指令的相关属性和方法
  beforeMount(el, binding, vnode) {
    // 在元素挂载前执行的操作
    console.log('元素即将挂载！');
  },
  updated(el, binding, vnode) {
    // 在元素更新时执行的操作
    console.log('元素更新啦！');
  },
  // 其他可能需要的钩子函数
};

export const hoverChangeColorDirective = {
  mounted(el, binding, vnode) {
    el.addEventListener('mouseover', () => {
      el.style.backgroundColor = binding.value;
    });
  },
  unmounted(el) {
    el.removeEventListener('mouseover', () => {});
  }
};