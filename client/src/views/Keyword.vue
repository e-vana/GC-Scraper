<template>
  <div>
    <div class="container">
      <h2>Product results for {{keywordName}}</h2>
      <code>Last updated @ {{lastUpdated}}</code>
      <b-table :items="keywordResults" :fields="fields">
        <template #cell(link)="data">
          <a :href="data.item.link">{{data.item.link}}</a>
        </template>
        <template #cell(realPrice)="data">
          <b>${{data.item.realPrice}}</b>
        </template>
      </b-table>
    </div>
  </div>
</template>


<script>
import axios from 'axios'

export default {
  data(){
    return {
      keywordResults: [],
      fields: [
        {
          key: 'title',
          label: 'Title',
        },
        {
          key: 'link',
          label: 'Link',
        },
        {
          key: 'condition',
          label: 'Condition',
        },
        // {
        //   key: 'id', label: 'Id',
        // },
        {
          key: 'realPrice',
          label: 'Price',
          sortable: true
        }
      ],
      keywordName: '',
      lastUpdated: ''
    }
  },
  created: async function() {
    try {
      let payload = {
        id: this.$route.params.id
      }
      let response = await axios.post(process.env.VUE_APP_API_URL+'/scrapes/findById', payload, {headers: {"Content-Type": "application/json"}});
      response.data.data.forEach(product => {
        product.realPrice = parseFloat(product.realPrice.replace(/,/g, ''));
        let priceStrToNum = Number(product.realPrice);
        // if(isNaN(priceStrToNum)){
        //   console.log(product.realPrice)
        // }
        product.realPrice = priceStrToNum;
      });
      this.keywordResults = response.data.data;

      let responseKeyword = await axios.post(process.env.VUE_APP_API_URL+'/scrapes/getKeywordFromId', payload, {headers: {"Content-Type": "application/json"}});
      this.keywordName = responseKeyword.data.keyword;
      let lastUpdated = new Date(responseKeyword.data.lastUpdated);
      this.lastUpdated = lastUpdated.toTimeString();

    } catch (error) {
      console.log(error);
    }

  }

}
</script>

<style>

</style>