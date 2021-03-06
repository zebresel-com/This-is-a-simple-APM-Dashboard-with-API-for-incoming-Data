/**
 * @autor       Kristof Friess
 * @company     Zebresel
 * @copyright   Since 2018 by Zebresel - Deine Agentur für digitale Medien
 * @description Default Routing System              
 */

/*jshint esversion: 6 */
/*jshint node: true*/

const MainController = require('./mainController.js');

class PagesController extends MainController
{
	constructor(app, req, res, controller, action, method)
	{
		super(app, req, res, controller, action, method);

		if(action === 'login')
		{
			this.userNeeded = false;
			this.loginNeeded = false;
		}

		this.cssFiles = [
			'/assets/css/layout.css'
		];
	}

	init(next)
	{
		const self = this;

		super.init(function(){
			if(self._action !== 'login')
			{
				// const variables for models
				const Application = self._app.models.Application;

				const currUser = self._req.currUser;

				// retreive all applications for a list display
				Application.findAll({
					where: {
					    deleted: false
					}
				}).then(function(applications){

					self.applications = applications;
					next();

				});
			}
			else
			{
				next();
			}
		});
	}

	actionIndex()
	{
		// default self wrap
		const self = this;

		// const variables for models
		const Application = self._app.models.Application;

		const currUser = self._req.currUser;

		// retreive all applications for a list display
		self.render({
			applications: self.applications
		});
	}

	actionLogin()
	{
		// default self wrap
		const self = this;

		self.cssFiles = [
			'/assets/css/login.css'
		];

		self.render({}, {
			layout: false
		});
	}

	actionApplicationDashboard()
	{
		// default self wrap
		const self = this;

		self.jsFiles = [
			'/assets/js/appDashboard.js',
			'/assets/js/template-renderer.js'
		];

		// const variables for models
		const Application = self._app.models.Application;

		// retreive all applications for a list display
		Application.findOne({
			where: {
			    deleted: false,
			    id: self.param('id')
			}
		}).then(function(application){

			if(!application)
			{
				self.redirect('/errors/404');	
			}
			else
			{
				self.render({
					application: application,
					applications: self.applications
				});
			}
			
		}).catch(function (err) {
  			self.redirect('/errors/500');
  			console.error('Tryed to retrive an application, but failed', err);
		});
	}
}

module.exports = PagesController;