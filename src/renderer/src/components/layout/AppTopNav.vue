<script setup lang="ts">
/**
 * 上下布局的顶部导航栏：左侧 logo，中间横向菜单（放不下时 antd 自动收进「…」），右侧明暗切换。
 * 菜单项与跳转逻辑和左侧导航栏共用 useAppNav。
 */
import kiroLogo from '@/assets/kiro-logo.png'
import { APP_DISPLAY_NAME } from '@shared/brand'
import ThemeModeIcon from '@/components/common/ThemeModeIcon.vue'
import { useSettingsStore } from '@/stores/settings'
import { useUpdateStore } from '@/stores/update'
import { useAppNav } from './useAppNav'

const settingsStore = useSettingsStore()
const updateStore = useUpdateStore()
const { items, selectedKeys, navigate, goHome, darkModeLabel, toggleDark } = useAppNav()
</script>

<template>
  <header class="app-topnav">
    <!-- 点 logo 回主页；点「新版本」角标打开更新弹窗 -->
    <div class="topnav-logo" role="link" aria-label="回到主页" @click="goHome">
      <img class="brand-logo" :src="kiroLogo" :alt="APP_DISPLAY_NAME" />
      <span v-if="updateStore.hasUpdate" class="topnav-badge" @click.stop="updateStore.showModal">新版本</span>
    </div>

    <a-menu
      :selected-keys="selectedKeys"
      mode="horizontal"
      class="topnav-menu"
      @click="navigate"
    >
      <!-- 顶部横排只放文字，不带图标：一行能多放几项，也更干净 -->
      <a-menu-item v-for="item in items" :key="item.key">{{ item.label }}</a-menu-item>
    </a-menu>

    <a-tooltip :title="darkModeLabel" placement="bottomRight">
      <!--
        显示要切换到的那一边：深色时是太阳，浅色时是月亮，与设置里的主题风格图标同一套。
        自绘 SVG 不走 #icon 插槽：antd 只把自家图标当成「纯图标按钮」居中，SVG 放进去会偏左
      -->
      <a-button type="text" class="topnav-theme" :aria-label="darkModeLabel" @click="toggleDark">
        <ThemeModeIcon :mode="settingsStore.isDark ? 'light' : 'dark'" :size="18" />
      </a-button>
    </a-tooltip>
  </header>
</template>

<style scoped>
.app-topnav {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 12px;
  height: 56px;
  padding: 0 16px;
  border-bottom: 1px solid var(--kal-border);
  background: var(--kal-sidebar-bg);
}

.topnav-logo {
  position: relative;
  flex: 0 0 auto;
  width: 32px;
  height: 32px;
  cursor: pointer;
}

.brand-logo {
  width: 32px;
  height: 32px;
  border-radius: 9px;
  object-fit: cover;
}

.topnav-badge {
  position: absolute;
  top: -7px;
  right: -22px;
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
}

/*
 * 菜单吃掉中间的剩余宽度，菜单项在其中居中；去掉横向菜单自带的底边，整条栏只留一条分隔线。
 * 放不下时 antd 把多余项收进「…」，居中不影响这个收纳。
 */
.topnav-menu {
  flex: 1 1 auto;
  min-width: 0;
  justify-content: center;
  border-bottom: none;
  background: transparent;
  line-height: 54px;
}

/* 正方形按钮，图标用 flex 正中摆放；宽高跟随按钮自身高度（随控件尺寸变化） */
.topnav-theme {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  padding: 0;
}
</style>
