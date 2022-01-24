import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    inventory: {
      items: [
        {
          code: "ACC1",
          product: "Apple granny smith",
          weight: "40 LB",
          stock: "3638066",
          category: "Fruits",
          updated: "2021-02-05 08:28:36",
        },
        {
          code: "ACC2",
          product: "Pineapple crownless",
          weight: "7 CT",
          stock: "6462020",
          category: "Fruits",
          updated: "2021-02-03 19:49:33",
        },
        {
          code: "ACC3",
          product: "Banana green",
          weight: "8 CT",
          stock: "8664948",
          category: "Fruits",
          updated: "2021-02-02 19:17:15",
        },
        {
          code: "ACC4",
          product: "Banana green tip",
          weight: "40 LB",
          stock: "2592335",
          category: "Fruits",
          updated: "2021-02-02 09:46:33",
        },
      ],
    },
  },
  mutations: {
    setInventoryStock(state, { stock, index }) {
      state.inventory.items[index].stock = stock;
    },
  },
  actions: {
    setInventoryStock({ commit, state }, { stock, index }) {
      //console.log(state.inventory.items[index].stock);
      //console.log(stock);
      if (state.inventory.items[index].stock !== stock)
        commit("setInventoryStock", { stock, index });
    },
  },
  getters: {
    getAllInventory(state) {
      const items = [];
      state.inventory.items.forEach((item, index) => {
        items[index] = {
          index: index,
          ...item
        };
      });
      return items;
    },
    getInventoryByFilter: (_, getters) => (filter) =>
      getters.getAllInventory.filter((item) => {
        filter = filter.trim().toLowerCase();
        return item.code.trim().toLowerCase().includes(filter)
          || item.product.trim().toLowerCase().includes(filter)
          || item.category.trim().toLowerCase().includes(filter);
      }),
  },
});
