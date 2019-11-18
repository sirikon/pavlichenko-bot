import { ContextMessageUpdate } from 'telegraf';
import FloodService from '../services/floodService';
import Logger from '../services/logger';

export default interface IContext extends ContextMessageUpdate {
	floodService: FloodService;
	log: Logger;
}
