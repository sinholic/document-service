import Document from '../model/Document';
import Folder from '../model/Folder';
import redis from '../redis';

class ServiceController {
	// Get all document from a collection
	static async getAll(req, res) {
		try {
			const cachedFolderData = await redis.get('folderData');
			const cachedDocumentData = await redis.get('documentData');
			let folderData: object[] = [];
			let documentData: object[] = [];
			switch (true) {
				case cachedFolderData && cachedDocumentData:
					folderData = JSON.parse(cachedFolderData);
					documentData = JSON.parse(cachedDocumentData);
					res.status(200).json({
						error: false,
						data: [...folderData, ...documentData],
					});
					break;
				case cachedFolderData && !cachedDocumentData:
					folderData = JSON.parse(cachedFolderData);
					documentData = await Document.find();
					await redis.set('documentData', JSON.stringify(documentData));
					res.status(200).json({
						error: false,
						data: [...folderData, ...documentData],
					});
					break;
				case cachedDocumentData && !cachedFolderData:
					documentData = JSON.parse(cachedDocumentData);
					folderData = await Folder.find();
					await redis.set('folderData', JSON.stringify(folderData));
					res.status(200).json({
						error: false,
						data: [...folderData, ...documentData],
					});
					break;
				default:
					documentData = await Document.find();
					await redis.set('documentData', JSON.stringify(documentData));
					folderData = await Folder.find();
					await redis.set('folderData', JSON.stringify(folderData));
					res.status(200).json({
						error: false,
						data: [...folderData, ...documentData],
					});
					break;
			}
		} catch (error) {
			res.status(500).json({ error });
		}
	}

	static async setFolder(req, res) {
		let { id, name, timestamp } = req.body;
		let user_id = req.user_id;
		let company_id = req.company_id;
		try {
			const checker = await Folder.findOne({ id });
			if (checker) {
				const folder = {
					id,
					name,
					timestamp,
					owner_id: user_id,
					company_id,
				};
				const data = await Folder.updateOne(
					{
						id,
					},
					{
						...folder,
					},
				);
				res.status(201).json({
					error: false,
					message: 'folder updated',
					data,
				});
			} else {
				const newfolder = new Folder({
					id,
					name,
					timestamp,
					owner_id: user_id,
					company_id,
				});
				const data = await Folder.create(newfolder);
				const newFolderData = await Folder.find();
				await redis.set('folderData', JSON.stringify(newFolderData));
				res.status(201).json({
					error: false,
					message: 'folder created',
					data,
				});
			}
		} catch (error) {
			res.status(500).json({
				error,
			});
		}
	}

	static async deleteFolder(req, res) {
		let { id } = req.body;
		try {
			await Folder.findOneAndDelete({ id });
			const newFolderData = await Folder.find();
			await redis.set('folderData', JSON.stringify(newFolderData));
			res.status(200).json({
				error: false,
				message: 'Success delete folder',
			});
		} catch (error) {
			res.status(500).json({
				error: 'internal server error',
			});
		}
	}

	static async getListFile(req, res) {
		const { folder_id } = req.params;
		let data: object[] = [];
		console.log('from cache');
		try {
			const cachedListFilePerFolderData = await redis.get('listFilePerFolder');
			if (cachedListFilePerFolderData) {
				const listFilePerFolder = JSON.parse(cachedListFilePerFolderData);
				if (listFilePerFolder.parameter_folderId === folder_id) {
					data = listFilePerFolder.data;
				} else {
					data = await Document.find({ folder_id });
					await redis.set(
						'listFilePerFolder',
						JSON.stringify({ data, parameter_folderId: folder_id }),
					);
				}
			} else {
				data = await Document.find({ folder_id });
				await redis.set(
					'listFilePerFolder',
					JSON.stringify({ data, parameter_folderId: folder_id }),
				);
			}
			res.status(200).json({
				error: false,
				data,
			});
		} catch (error) {
			res.status(500).json({
				error,
			});
		}
	}

	static async setDocument(req, res) {
		let {
			id,
			name,
			type,
			folder_id,
			content,
			timestamp,
			owner_id,
			share,
			company_id,
		} = req.body;
		let data: object;
		try {
			const checker = await Document.findOne({ id });
			if (checker) {
				const document = {
					id,
					name,
					type,
					folder_id,
					content,
					timestamp,
					owner_id,
					share,
					company_id,
				};
				data = await Document.updateOne(
					{
						id,
					},
					{
						...document,
					},
				);
			} else {
				const newDocument = new Document({
					id,
					name,
					type,
					folder_id,
					content,
					timestamp,
					owner_id,
					share,
					company_id,
				});
				data = await Document.create(newDocument);
				const newDocumentData = await Document.find();
				await redis.set('documentData', JSON.stringify(newDocumentData));
			}
			res.status(201).json({
				error: false,
				message: 'success set document',
				data,
			});
		} catch (error) {
			res.status(500).json({
				error,
			});
		}
	}

	static async getDetailDocument(req, res) {
		let { document_id } = req.params;
		try {
			const cachedGetDetailDocumentData = await redis.get('getDetailDocument');
			if (cachedGetDetailDocumentData) {
				let getDetailDocumentData = JSON.parse(cachedGetDetailDocumentData);
				if (getDetailDocumentData.id == document_id) {
					res.status(200).json({
						error: false,
						data: getDetailDocumentData,
					});
				} else {
					const data = await Document.findOne({ id: document_id });
					await redis.set('getDetailDocument', JSON.stringify(data));
					res.status(200).json({
						error: false,
						data,
					});
				}
			} else {
				const data = await Document.findOne({ id: document_id });
				await redis.set('getDetailDocument', JSON.stringify(data));
				res.status(200).json({
					error: false,
					data,
				});
			}
		} catch (error) {
			res.status(500).json({
				error,
			});
		}
	}

	static async deleteDocument(req, res) {
		const { id } = req.body;
		try {
			await Document.findOneAndDelete({ id });
			const newDocumentData = await Document.find();
			await redis.set('documentData', JSON.stringify(newDocumentData));
			res.status(200).json({
				error: false,
				message: 'Success delete document',
			});
		} catch (error) {
			res.status(500).json({
				error: 'internal server error',
			});
		}
	}
}

export default ServiceController;
