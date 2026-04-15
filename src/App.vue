<template>
  <el-config-provider :locale="locale">
    <div class="app" style="width: 100%;height: 100%;">
      <router-view />
    </div>
  </el-config-provider>
</template>
<script setup>
import useLocale from '@/hooks/locale'
import { computed } from 'vue'
const { currentLocale } = useLocale()
import zhCn from 'element-plus/es/locale/lang/zh-cn.mjs'
import zhTw from 'element-plus/es/locale/lang/zh-tw.mjs'
import en from 'element-plus/es/locale/lang/en.mjs'
import th from 'element-plus/es/locale/lang/th.mjs'
import vi from 'element-plus/es/locale/lang/vi.mjs'
import fr from 'element-plus/es/locale/lang/fr.mjs'
import es from 'element-plus/es/locale/lang/es.mjs'
import ptBr from 'element-plus/es/locale/lang/pt-br.mjs'
import ru from 'element-plus/es/locale/lang/ru.mjs'
import id from 'element-plus/es/locale/lang/id.mjs'
import tr from 'element-plus/es/locale/lang/tr.mjs'
import fa from 'element-plus/es/locale/lang/fa.mjs'
import ja from 'element-plus/es/locale/lang/ja.mjs'
import ar from 'element-plus/es/locale/lang/ar.mjs'
import uk from 'element-plus/es/locale/lang/uk.mjs'
import az from 'element-plus/es/locale/lang/az.mjs'
import ko from 'element-plus/es/locale/lang/ko.mjs'
const locale = computed(() => {
  const map = {
    'zh-CN': zhCn,
    'zh-TW': zhTw,
    'en-US': en,
    'th-TH': th,
    'vi-VN': vi,
    'fr-FR': fr,
    'es-ES': es,
    'pt-PT': ptBr,
    'ru-RU': ru,
    'id-ID': id,
    'tr-TR': tr,
    'fa-IR': fa,
    'ja-JP': ja,
    'ar-SA': ar,
    'uk-UA': uk,
    'az-AZ': az,
    'ko-KR': ko,
    // No official Element Plus locale package currently.
    'ka-GE': en,
  }
  return map[currentLocale.value] || en
})
</script>
<style>
	.maptalks-close{
		display: none !important;
	}
	.maptalks-attribution{
		display: none !important;
	}
	.maptalks-msgBox .maptalks-msgContent{
		padding: 0px !important;
	}
	
	/* =========================================================
	   Element Plus 表格美化样式
	   适用版本：Vue3 + Element Plus
	   使用方式：给 el-table 增加 class="ep-table-beauty"
	   ========================================================= */
	
	/* ---------- 基础结构 ---------- */
	.ep-table-beauty {
	  --ep-row-height: 24px;
	  --ep-font-size: 14px;
	}
	
	/* ---------- 表头样式 ---------- */
	.ep-table-beauty .el-table__header-wrapper th {
	  background-color: var(--el-fill-color-light);
	  color: var(--el-text-color-primary);
	  font-weight: 600;
	  font-size: 14px;
	  height: var(--ep-row-height);
	  border-bottom: 1px solid var(--el-border-color-lighter);
	}
	
	/* 表头 hover（细节增强） */
	.ep-table-beauty .el-table__header th:hover {
	  background-color: var(--el-fill-color);
	}
	
	/* ---------- 表体行 ---------- */
	.ep-table-beauty .el-table__row {
	  height: var(--ep-row-height);
	  font-size: var(--ep-font-size);
	  color: var(--el-text-color-regular);
	}
	
	/* 单元格 padding（更商务紧凑） */
	.ep-table-beauty .el-table__cell {
	  padding: 6px 12px;
	}
	
	/* ---------- Hover 行高亮 ---------- */
	.ep-table-beauty .el-table__body tr:hover > td {
	  background-color: var(--el-color-primary-light-9);
	}
	
	/* ---------- 奇偶行区分（轻量） ---------- */
	.ep-table-beauty .el-table__body tr:nth-child(2n) > td {
	  background-color: var(--el-fill-color-extra-light);
	}
	
	/* ---------- 当前选中行 ---------- */
	.ep-table-beauty .el-table__body tr.current-row > td {
	  background-color: var(--el-color-primary-light-8) !important;
	}
	
	/* ---------- 边框优化 ---------- */
	.ep-table-beauty.el-table--border .el-table__cell {
	  border-right: 1px solid var(--el-border-color-lighter);
	}
	
	/* ---------- 空数据 ---------- */
	.ep-table-beauty .el-table__empty-text {
	  color: var(--el-text-color-secondary);
	  font-size: 13px;
	}
	
	/* ---------- 操作列按钮 ---------- */
	.ep-table-beauty .el-button--text {
	  padding: 0 6px;
	  font-size: 13px;
	}
	
	/* ---------- 固定列阴影柔化 ---------- */
	.ep-table-beauty .el-table__fixed-right::before,
	.ep-table-beauty .el-table__fixed::before {
	  background-color: var(--el-border-color-lighter);
	}
	
	/* ---------- 滚动条（可选） ---------- */
	.ep-table-beauty ::-webkit-scrollbar {
	  height: 8px;
	  width: 8px;
	}
	
	.ep-table-beauty ::-webkit-scrollbar-thumb {
	  background-color: var(--el-border-color);
	  border-radius: 4px;
	}
	
	.ep-table-beauty ::-webkit-scrollbar-track {
	  background-color: transparent;
	}

	 
</style>