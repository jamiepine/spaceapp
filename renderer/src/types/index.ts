export interface User {
  id: string;
  name: string;
  email: string;
  verified_email: string;
  new_email: string;
  plan_type: Plan;
  google_access_token: string;
  google_refresh_token: string;
}
export enum Plan {
  FREE,
  TIER1,
  TIER2,
  TIER3
}
export interface Library {
  id: string;
  name: string;
  media_object_count: number;
  encrypted: boolean;
  encryption_algorithm: '128-AES' | '192-AES' | '256-AES';
  public: boolean;
  date_created: string;
}
export interface User_Library {
  library_id: string; // Library PK
  user_id: string; // User PK
  date_joined: string;
}
export interface File {
  id?: number;
  integrity_hash: string;
  uri: string;
  thumbnail: boolean;
  file_name: string;
  size: number;
  extension: string;
  mime: string;
  date_created: Date;
  date_modified: Date;
  date_indexed: Date;
  geolocation: string;
  extra_meta?: VideoMeta | ImageMeta | AudioMeta;
  storage_device: string; //Storage PK
  captured_on: string; // Device PK
  added_by: string; // User PK
  parent: string; // File PK
  extra_data: any;
}
export interface Directory {
  id: string;
  file_name: string;
  mime: string;
}
export interface VideoMeta {
  codecs: Array<string>;
  bitrate: {
    video: string;
    audio: string;
  };
  duration_seconds: number;
}
export interface ImageMeta {
  dimensions: {
    width: string;
    height: string;
  };
  color_space: string;
  aperture: number;
  exposure_mode: number;
  exposure_program: number;
  f_number: number;
  flash: boolean;
  focal_length: number;
  has_alpha_channel: boolean;
  iso_speed: number;
  orientation: number;
  metering_mode: number;
}
export interface AudioMeta {}

export interface Tag {
  id: string;
  tag_count: number;
  name: string;
  date_created: string;
  created_by: string; // User PK
}
export interface Tag_File {
  media_object_id: string; // File PK
  tag_id: string; // Tag PK
  date_created: string;
  created_by: string; // User PK
}
export interface Marker {
  id: string;
  media_object_id: string; // File PK
  name: string;
  description: string;
  date_created: string;
  created_by: string; // User PK
}
export interface Comment {
  id: string;
  media_object_id: string; // File PK
  content: string;
  date_created: string;
  created_by: string; // User PK
}
export interface Task {
  id: string;
  type: TaskType;
  progress: number;
  native: boolean; // JS or Go task
  date_created: string;
  created_by: string; // User PK
  parent_task: string; // Task PK
  completed: boolean;
}
export enum TaskType {
  IMPORT_MEDIA = 'IMPORT_MEDIA',
  GENERATE_PREVIEW = 'GENERATE_PREVIEW',
  CLOUD_UPLOAD = 'CLOUD_UPLOAD',
  FINALIZE_EDIT = 'FINALIZE_EDIT',
  LOCAL_TRANSFER = 'LOCAL_TRANSFER'
}
export interface StorageDevice {
  id: string;
  type: 'internal_disk' | 'removable_disk' | 'cloud' | 'mobile_device';
  name: string;
  integrity_hash: string;
  capacity_bytes: number;
  used_storage_bytes: number;
  date_created: string;
  created_by: string; // User PK
}
export interface RecordingDevice {
  id: string;
  name: string;
  type: 'dslr' | 'cinema_camera' | 'smartphone' | 'audio_recorder';
  integrity_hash: string;
  date_created: string;
  created_by: string; // User PK
}
