// 按账号隔离 UA 机器码
//
// 背景：官方请求头是 `KiroIDE-<版本>-<机器码>`，机器码取的是**操作系统**的设备标识
// （macOS IOPlatformUUID / Windows MachineGuid）。一台机器上挂 20 个号时，这 20 个号
// 发出去的机器码完全一样，是服务端最容易把账号串起来的一条信号。
//
// 这个模块给每个账号派生一个**稳定**的独立机器码：
//   machineId = sha256(`<salt>:<accountId>`)
// salt 存在设置里，首次启动生成一次，之后不变；所以同一个账号跨重启机器码恒定，
// 不同账号之间互不相同。
//
// 注册表用 accessToken 做索引：所有构造 UA 的地方本来就都拿着 token，不用改函数签名
// 到处传 accountId。token 轮换后下一次读取账号会重新登记，旧 key 自然失效。
import { createHash } from 'crypto'

let enabled = false
let salt = ''

/** accessToken → 该账号的机器码 */
const tokenToMachineId = new Map<string, string>()

/** 上限保护：凭证轮换会不断产生新 key，超过就整体重建 */
const MAX_ENTRIES = 5000

/** 由设置驱动的一次性配置；关闭时清空注册表，UA 回落到系统机器码 */
export function configureAccountIdentity(opts: { enabled: boolean; salt: string }): void {
  const nextEnabled = opts.enabled === true
  const nextSalt = opts.salt || ''
  if (nextEnabled !== enabled) tokenToMachineId.clear()
  enabled = nextEnabled
  salt = nextSalt
}

export function perAccountMachineIdEnabled(): boolean {
  return enabled
}

/** 稳定派生：同一 accountId 永远得到同一个 64 位 hex */
export function machineIdForAccount(accountId: string): string {
  if (!accountId || !salt) return ''
  return createHash('sha256').update(`${salt}:${accountId}`).digest('hex')
}

/** 登记账号当前的 accessToken 与它对应的机器码 */
export function registerAccountIdentity(accountId: string, accessToken?: string): void {
  if (!enabled || !accountId || !accessToken) return
  const mid = machineIdForAccount(accountId)
  if (!mid) return
  if (tokenToMachineId.size >= MAX_ENTRIES) tokenToMachineId.clear()
  tokenToMachineId.set(accessToken, mid)
}

/** 取某个 token 对应的机器码；未登记（或功能关闭）时返回 undefined，调用方回落到系统机器码 */
export function machineIdForToken(token?: string): string | undefined {
  if (!enabled || !token) return undefined
  return tokenToMachineId.get(token)
}

/** 清空注册表（例如导入/删除账号后重新登记） */
export function resetAccountIdentities(): void {
  tokenToMachineId.clear()
}
