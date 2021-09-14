import dlog from '../dlog';
import { getFileName, getSuffix, sizeTostr } from '../file-tool';
import { getUploadFilePath, doUpload } from './index';

const TAG = '[FileUploader]';

/**
 * 文件上传组件的逻辑，抽离与 UI 无关的逻辑，方便不同端复用
 */
export default class FileUploader {
  fileList;

  options = {
    folder: 'default', // oss 文件上传的模块目录名
    maxCount: 5, // 默认最多上传 5 份
    maxSize: 20971520, // 默认最大上传 20M
    toastFn: () => {} // 弹窗提示的方法，由外部注入
  };

  // 字段映射配置
  defaultField = {
    name: 'name',
    suffix: 'suffix',
    size: 'size',
    url: 'url'
  };

  constructor(options) {
    Object.assign(this.options, options);
  }

  updateFileList(fileList) {
    if (fileList) {
      fileList.forEach(v => this.parseFileInfo(v));
    }
    this.fileList = fileList;
    dlog.log(TAG, 'updateFileList', this.fileList);
  }

  /**
   * 更新字段映射配置
   * @param {*} fieldConfig
   */
  updateFieldConfig(fieldConfig) {
    Object.assign(this.defaultField, fieldConfig);
    dlog.log(TAG, 'updateFieldConfig', this.defaultField);
  }

  /**
   * 更新文件上传的相关配置
   * @param {*} options
   */
  updateOptions(options) {
    Object.assign(this.options, options);
    dlog.log(TAG, 'updateOptions', this.options);
  }

  /**
   * 预处理文件信息，添加上文件相关信息字段
   * @param {*} file
   */
  parseFileInfo(file) {
    const url = file[this.defaultField.url] || '';
    file[this.defaultField.url] = url;
    const name = file[this.defaultField.name] || file.file?.name || getFileName(url) || '';
    file[this.defaultField.name] = name;
    file[this.defaultField.suffix] = getSuffix(name);
    file[this.defaultField.size] = file[this.defaultField.size] || file.file?.size || '';
  }

  /**
   * 选择完文件，但在文件被放入待上传列表前执行
   * @param {Object | Array} file 选完文件返回的 File 对象数据，可以是一个文件对象，也可以是文件数组对象
   * @returns true 表示可以上传，false 表示拦截此次选择的文件上传
   */
  beforeRead(file) {
    let files = file;
    if (!Array.isArray(file)) {
      files = [file];
    }
    dlog.log(TAG, 'beforeRead()', files);
    const maxCount = this.options.maxCount;
    if (maxCount > 0 && this.fileList.length + files.length > maxCount) {
      const message = '文件数量不能超过' + maxCount;
      this.options.toastFn({ message: message, duration: 5000 });
      return false;
    }
    return true;
  }

  /**
   * 选择完文件，并通过预处理，加入待上传列表后执行，可在这里执行上传文件逻辑
   * @param {Object | Array} file 包裹了原生 File 数据的 wrapper 对象，增加了文件上传相关信息字段，e.g {file: File, status: '', message: ''}，可以是一个文件对象，也可以是数组对象
   * @param {*} detail
   */
  async afterRead(file, detail) {
    dlog.log(TAG, 'afterRead()', detail, file);
    let files = file;
    if (!Array.isArray(file)) {
      files = [file];
    }
    files.forEach(file => {
      this.parseFileInfo(file);
    });
    const { folder } = this.options;
    await Promise.all(
      files.map(async file => {
        file.status = 'uploading';
        file.message = '上传中';
        const filePath = getUploadFilePath({ folder: folder, fileName: file.file.name });
        try {
          const res = await doUpload(filePath, file.file, {
            progress: p => {
              file.message = '上传中(' + (p * 100).toFixed(0) + '%)';
            }
          });
          file.status = 'done';
          file.url = res.url;
          file.message = '';
          // 埋点日志
          window.$log('文件上传', {
            ...file,
            filePath: filePath
          });
        } catch (error) {
          console.error(TAG, file.file.name, error);
          // 埋点日志
          window.$log('文件上传', {
            ...file,
            filePath: filePath
          });
          this.options.toastFn(file.file.name + '上传失败');
          file.status = 'failed';
          file.message = '上传失败';
        }
      })
    );
    dlog.log(TAG, 'all file upload', this.fileList);
  }

  /**
   * 文件超出限制大小时调用，传入超出大小的文件
   * @param {*} file {Object | Array} file 包裹了原生 File 数据的 wrapper 对象，增加了文件上传相关信息字段，e.g {file: File, status: '', message: ''}，可以是一个文件对象，也可以是数组对象
   * @param {*} detail
   */
  onOversize(file, detail) {
    let files = file;
    if (!Array.isArray(file)) {
      files = [file];
    }
    const message = files.map(v => v.file?.name || '').join('，') + '文件不能超过' + sizeTostr(this.options.maxSize);
    dlog.log(TAG, 'onOversize()', message, detail, file);
    this.options.toastFn({ message: message, duration: 5000 });
  }
}
