<template>
	
	  <div  class="el-table el-table--fit el-table--striped el-table--border el-table--scrollable-x el-table--enable-row-hover el-table--enable-row-transition">
	  <div class="el-table__header-wrapper">
	    <table cellspacing="0" cellpadding="0" border="0" class="el-table__header" style="width: 100%;">
	      <colgroup>
	        <col name="el-table_1_column_1" width="150">
	        <col name="el-table_1_column_2" width="300">
	      </colgroup>
	      <thead>
	        <tr>
	          <th colspan="1" class="el-table_1_column_1     is-leaf is-sortable el-table__cell">
	            <div class="cell">属性名称</div>
	          </th>
	          <th colspan="1" class="el-table_1_column_2     is-leaf is-sortable el-table__cell">
	            <div class="cell">属性值</div>
	          </th>
	        </tr>
	      </thead>
	    </table>
	  </div>
	  <div>
	    <table cellspacing="0" cellpadding="0" border="0" class="el-table__body" style="width: 100%;">
	      <colgroup>
	        <col name="el-table_1_column_1" width="150">
	        <col name="el-table_1_column_2" width="300">
	      </colgroup>
	      <tbody>
	        <tr class="el-table__row" v-for="(item,index) in propData">
	          <td colspan="1" class="el-table_1_column_1 el-table__cell" >
	            <div class="cell" >{{item.name}}</div>
	          </td>
	          <td colspan="1" class="el-table_1_column_1 el-table__cell" style="padding: 0px;">
	            <div v-if="!item.isEdit||item.editor=='display'" class="cell" @click="cellClick(item)" style="width: 100%;height: 100%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{item.value}}&nbsp; </div>
	            <el-input  :ref="el => iptRefs[item.id] = el" v-if="item.isEdit&&item.editor=='text'" v-model="item.value" @blur="item.isEdit=false;save(item)" @keypress="keypress($event,item)" spellcheck="false" autocomplete="off"/>
	
	          <el-select  :ref="el => iptRefs[item.id] = el" style="width:100%" v-if="item.isEdit&&item.editor=='boolean'" v-model="item.value"  @change="item.isEdit=false;save(item)"
	           filterable
	           placeholder="请选择">
	              <el-option
	                key="true"
	                label="true"
	                value="true">
	              </el-option>
	              <el-option
	                key="false"
	                label="false"
	                value="false">
	              </el-option>
	            </el-select>
	
	
	            <el-select  :ref="el => iptRefs[item.id] = el"  style="width:100%" v-if="item.isEdit&&item.editor=='combobox'" v-model="item.value"  @change="item.isEdit=false;save(item)"
	            clearable
	            filterable placeholder="请选择">
	                <el-option v-for="(it,index) in item.items"
	                  :key="it.value"
	                  :label="it.text"
	                  :value="it.value">
	                </el-option>
	              </el-select>
	          </td>
	        </tr>
	
	        <!---->
	      </tbody>
	    </table>
	  </div>
	  </div>
</template>

<script setup>
	import { ref,watch,computed,onMounted,onUnmounted,defineProps,defineEmits,defineExpose,nextTick   } from 'vue';
	import api from '@/hooks/api'
	import {lgxInfo,lgxInfo2,getEntityString,getTextString,getValueString,format1} from '@/hooks/lingx'
	import { ElLoading } from 'element-plus'
	const emit = defineEmits(['custom-event']);
	import { useI18n } from 'vue-i18n'
	const { t } = useI18n();
	const propData =ref([]);
	const code=ref("");
	const id=ref("");
	const iptRefs = ref({});

	
	function reloadData(code1,id1){
	  code.value=code1;
	  id.value=id1;
	  api.callApi({apicode:9007,code:code1,id:id1},function(json){
	     propData.value=json.data;
	   });
	}
	
	
	function keypress(e,item){
	    if(e.keyCode==13){
	     item.isEdit=false;
	     save(item);
	    }
	  }
	function cellClick(item){
	    closeAllEdit();
	    item.isEdit=true;
	    item.oldValue=item.value;

		nextTick(() => {
		    // Element Plus 需要通过 input 拿到原生 input
		    iptRefs.value[item.id]?.focus()
		  })
	  }
	 function save(item){
	    if(item.oldValue!=item.value){
	      emit('updatePropties',item);
	      api.callApi({apicode:9008,code:code.value,id:id.value,prop:item.id,value:item.value},function(json){
	      lgxInfo(json.message)
	     });
	     }
	  }
	function  closeAllEdit(){
	    propData.value.forEach(function(item,index){
	      item.isEdit=false;
	    });
	}
	defineExpose({reloadData});
</script>

<style>
</style>
