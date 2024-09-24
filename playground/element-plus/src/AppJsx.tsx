/*
 * @Description:
 * @Author: wangbowen936926
 * @Date: 2024-09-17 18:04:59
 * @LastEditTime: 2024-09-17 18:15:28
 * @FilePath: \vite-plugin-auto-inject-css\playground\element-plus\src\AppJsx.tsx
 */
import { ElButton } from 'element-plus'
import './card.scss'

export default () => {
  return (
    <>
      <ElButton>Default</ElButton>
      <ElButton type="primary">Primary</ElButton>
      <ElButton type="success">Success</ElButton>
      <ElButton type="info">Info</ElButton>
      <ElButton type="warning">Warning</ElButton>
      <ElButton type="danger">Danger</ElButton>
    </>
  )
}
