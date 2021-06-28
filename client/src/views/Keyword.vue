<template>
  <div>
    <div class="container">
      <h2>Product results for {{keywordName}}</h2>
      <code>Last updated @ {{lastUpdated}}</code>
      <b-table :items="keywordResults"></b-table>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data(){
    return {
      keywordResults: [],
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