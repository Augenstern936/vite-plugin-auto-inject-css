export const formatComponentName = (v: string): string => {
  return v.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}
