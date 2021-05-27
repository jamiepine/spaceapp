const drivelist = window.require('drivelist');

export async function getDrives() {
  const drives = await drivelist.list();
  return drives;
}
