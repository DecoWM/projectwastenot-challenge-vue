<template>
  <b-container class="mt-2 px-4" fluid>
    <h1 class="mb-4">Inventory</h1>
    <b-row>
      <b-col cols="3">
        <b-input-group>
          <b-form-input
            type="text"
            placeholder="Product search"
            v-stream:input="filterSubject"
          />
          <b-input-group-append>
            <b-input-group-text>
              <b-icon icon="search" />
            </b-input-group-text>
          </b-input-group-append>
        </b-input-group>
      </b-col>
    </b-row>
    <b-table class="mt-4" hover head-variant="light" :items="items" :fields="fields">
      <template #cell(editStock)="data">
        <b-input-group prepend="Qty">
          <!-- Mask not working properly (ex. 2,344,322) -->
          <!--b-form-input
            type="text"
            v-model="data.item.stock"
            v-mask="numericMasks[data.item.index]"
            v-on:input="stockChange($event, data.item.index)"
          /-->
          <b-form-input
            type="text"
            v-model="data.item.stock"
            v-on:input="stockChange($event, data.item.index)"
          />
        </b-input-group>
      </template>
    </b-table>
  </b-container>
</template>

<script>
import { Subject } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
//import createNumberMask from "text-mask-addons/dist/createNumberMask";

export default {
  name: "CustomTable",
  data: () => ({
    dataItems: null,
    stockSubjects: [],
    numericMasks: [],
    fields: [
      {
        key: "code",
        label: "Item code",
      },
      {
        key: "product",
        label: "Product",
        sortable: true,
        thStyle: { width: "25%" },
        tdClass: "colored",
      },
      {
        key: "weight",
        label: "Package",
        sortable: true,
      },
      {
        key: "stock",
        label: "Available units",
        sortable: true,
      },
      {
        key: "category",
        label: "Category",
      },
      {
        key: "updated",
        label: "Last updated",
        sortable: true,
      },
      {
        key: "editStock",
        label: "Edit available quantity",
      },
    ],
  }),
  computed: {
    filterSubject() {
      const subject = new Subject();
      subject
        .pipe(debounceTime(300), distinctUntilChanged())
        .subscribe((filter) => {
          if (filter.event.msg) {
            this.dataItems = this.$store.getters.getInventoryByFilter(filter.event.msg);
          } else {
            this.dataItems = this.$store.getters.getAllInventory;
          }
        });
      return subject;
    },
    items() {
      if (this.dataItems == null) {
        this.initItems();
      }
      return this.dataItems;
    },
  },
  methods: {
    initItems() {
      this.dataItems = this.$store.getters.getAllInventory;
      this.dataItems.forEach((item) => {
        this.stockSubjects[item.index] = new Subject();
        this.stockSubjects[item.index]
          .pipe(debounceTime(300), distinctUntilChanged())
          .subscribe((newStock) => {
            this.$store.dispatch("setInventoryStock", { stock: newStock, index: item.index });
          });
        // Mask not working properly (ex. 2,344,322)
        /*this.numericMasks[item.index] = (value) => {
          console.log(value, item.index);
          const mask = createNumberMask({
            prefix: "",
            allowDecimal: true,
            includeThousandsSeparator: true,
            allowNegative: false,
          });
          return mask(value);
        }*/
      });
    },
    stockChange(newStock, index) {
      this.stockSubjects[index].next(
        // This transformation was designed with masking in mind
        parseFloat(newStock.replaceAll(",", "")).toString()
      );
    },
  },
};
</script>

<style>
.table td {
  vertical-align: middle !important;
}
.colored {
  font-weight: 500;
  color: darkgreen;
}
</style>
