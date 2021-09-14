export default [
  {
    path: "/home",
    name: "home",
    component: () => import("@/views/home/index.vue")
  },
  {
    path: "*",
    redirect: {
      name: "home"
    }
  }
];
