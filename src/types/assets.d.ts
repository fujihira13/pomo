declare module "*.mp3" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const value: any; // 音声ファイルの型は実行時に決定されるため、anyを使用
  export default value;
}
