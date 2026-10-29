<script setup lang="ts">
import { computed } from 'vue'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue'
import kiroLogo from '@/assets/kiro-logo.png'
import { APP_DISPLAY_NAME } from '@shared/brand'
import ThemeModeIcon from '@/components/common/ThemeModeIcon.vue'
import { useSettingsStore } from '@/stores/settings'
import { useUpdateStore } from '@/stores/update'
import { useAppNav } from './useAppNav'

const settingsStore = useSettingsStore()
const updateStore = useUpdateStore()
const { items, selectedKeys, navigate, goHome, darkModeLabel, toggleDark } = useAppNav()

const collapsed = computed(() => settingsStore.settings.sidebarCollapsed)
</script>

<template>
  <aside
    class="app-sidebar"
    :class="{ collapsed }"
    :style="{ width: collapsed ? '80px' : '228px' }"
  >
    <div class="sidebar-brand">
      <!-- 点 logo 回主页；点「新版本」角标打开更新弹窗 -->
      <div class="brand-logo-wrap" role="link" aria-label="回到主页" @click="goHome">
        <img class="brand-logo" :src="kiroLogo" :alt="APP_DISPLAY_NAME" />
        <span v-if="updateStore.hasUpdate" class="brand-update-badge" @click.stop="updateStore.showModal">
          新版本
        </span>
      </div>
    </div>

    <a-menu
      :selected-keys="selectedKeys"
      :inline-collapsed="collapsed"
      mode="inline"
      style="border-inline-end: none; flex: 1 1 auto"
      @click="navigate"
    >
      <a-menu-item v-for="item in items" :key="item.key" :title="item.label">
        <template #icon><component :is="item.icon" /></template>
        <span>{{ item.label }}</span>
      </a-menu-item>
    </a-menu>

    <!-- 自己用 flex 排版，折叠态的居中不依赖 antd 组件的内部结构 -->
    <div class="sidebar-footer">
      <a-tooltip :title="collapsed ? darkModeLabel : ''" placement="right">
        <a-button
          type="text"
          class="footer-btn"
          @click="toggleDark"
        >
          <!-- 显示要切换到的那一边：深色时是太阳，浅色时是月亮，与设置里的主题风格图标同一套 -->
          <template #icon>
            <ThemeModeIcon :mode="settingsStore.isDark ? 'light' : 'dark'" :size="16" class="theme-icon" />
          </template>
          <span v-if="!collapsed">{{ darkModeLabel }}</span>
        </a-button>
      </a-tooltip>
      <a-tooltip :title="collapsed ? '展开侧栏' : ''" placement="right">
        <a-button
          type="text"
          class="footer-btn"
          @click="settingsStore.update({ sidebarCollapsed: !collapsed })"
        >
          <template #icon>
            <MenuUnfoldOutlined v-if="collapsed" />
            <MenuFoldOutlined v-else />
          </template>
          <span v-if="!collapsed">收起侧栏</span>
        </a-button>
      </a-tooltip>
    </div>
  </aside>
</template>


<style scoped>
.brand-logo-wrap {
  position: relative;
  width: 34px;
  height: 34px;
  cursor: pointer;
}

.brand-update-badge {
  position: absolute;
  top: -7px;
  right: -20px;
  z-index: 1;
  padding: 0 5px;
  border: 2px solid var(--kal-sidebar-bg);
  border-radius: 9px;
  color: #fff;
  background: #ff4d4f;
  font-size: 10px;
  font-weight: 600;
  line-height: 16px;
  white-space: nowrap;
  box-shadow: 0 2px 6px rgba(255, 77, 79, 0.3);
}
</style>