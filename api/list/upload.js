import {
	sendUpload,
	sendUploads
} from '../request'


// 上传头像 单张
export function uploadFile(filePath, file) {
	let url = '/app/common/storage/upload'
	return sendUpload(url, filePath, file)
}

// 上传图片多张
export function uploadFiles(fileList) {
	let url = '/app/common/storage/uploads'
	return sendUploads(url, fileList)
}