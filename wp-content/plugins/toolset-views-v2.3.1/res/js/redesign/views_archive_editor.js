var WPV_Toolset = WPV_Toolset  || {};

if ( typeof WPV_Toolset.CodeMirror_instance === "undefined" ) {
	WPV_Toolset.CodeMirror_instance = {};
}
if ( typeof WPV_Toolset.CodeMirror_instance_value === "undefined" ) {
	WPV_Toolset.CodeMirror_instance_value = {};
}
if ( typeof WPV_Toolset.CodeMirror_instance_qt === "undefined" ) {
	WPV_Toolset.CodeMirror_instance_qt = {};
}

var WPViews = WPViews || {};

// Instances definition

WPViews.EditScreenEditors = function( $ ) {

	var self = this;
	
	self.editor_keymap = {
		// Shift + Ctrl + Space = Try to edit the current Views shortcode under the cursor
		"Ctrl-Alt-Space": function( cm ) {
					var textarea_id = cm.getTextArea().id;
					if ( 
						textarea_id !== undefined 
						&& _.has( WPV_Toolset.CodeMirror_instance, textarea_id ) 
					) {
						Toolset.hooks.doAction( 'wpv-action-wpv-shortcodes-gui-maybe-edit-shortcode', textarea_id );
					}
				}
	};
	
	self.init_hooks = function() {
		
		/**
		 * Initialize Codemirror for a textarea.
		 *
		 * Includes Quicktags and keymap shortcuts.
		 *
		 * @since 2.3.0
		 */
		Toolset.hooks.addAction( 'wpv-action-wpv-edit-screen-init-codemirror-editor', self.init_codemirror_editor );
		
		/**
		 * Initialize Codemirror for a textarea.
		 *
		 * Does not include Quicktags nor keymap shortcuts.
		 *
		 * @since 2.3.0
		 */
		Toolset.hooks.addAction( 'wpv-action-wpv-edit-screen-init-codemirror-auxiliar-editor', self.init_codemirror_auxiliar_editor, 10, 2 );
		
		/**
		 * Delete a Codemirror editor.
		 *
		 * @since 2.3.0
		 */
		Toolset.hooks.addAction( 'wpv-action-wpv-edit-screen-delete-codemirror-editor', self.delete_codemirror_editor );
		
		return self;
		
	};
	
	self.init_main_editors = function() {
		
		self.init_codemirror_editor( 'wpv_filter_meta_html_content' );
		self.init_codemirror_auxiliar_editor( 'wpv_filter_meta_html_css', 'css' );
		self.init_codemirror_auxiliar_editor( 'wpv_filter_meta_html_js', 'javascript' );
		
		self.init_codemirror_editor( 'wpv_layout_meta_html_content' );
		self.init_codemirror_auxiliar_editor( 'wpv_layout_meta_html_css', 'css' );
		self.init_codemirror_auxiliar_editor( 'wpv_layout_meta_html_js', 'javascript' );
		
		self.init_codemirror_editor( 'wpv_content' );
		
		_.defer( function() {
			// CSS Components compatibility
			Toolset.hooks.doAction( 'toolset_text_editor_CodeMirror_init', 'wpv_filter_meta_html_content' );
			Toolset.hooks.doAction( 'toolset_text_editor_CodeMirror_init', 'wpv_layout_meta_html_content' );
			Toolset.hooks.doAction( 'toolset_text_editor_CodeMirror_init', 'wpv_content' );
		});
		
		return self;
	};
	
	/**
	 * Instantiate a Codemirror editor based on its ID.
	 *
	 * Generates the Codemirror instance, caches the editor value, adds Quicktags and Codemirror keymap shortcuts.
	 *
	 * @since 2.3.0
	 */
	
	self.init_codemirror_editor = function( editor_id ) {
		
		// Instantiate Codemirror
		WPV_Toolset.CodeMirror_instance[ editor_id ]		= icl_editor.codemirror( editor_id, true );
		// Cache the editor value
		WPV_Toolset.CodeMirror_instance_value[ editor_id ]	= WPV_Toolset.CodeMirror_instance[ editor_id ].getValue();
		// Instantiate Quicktags
		WPV_Toolset.CodeMirror_instance_qt[ editor_id ]		= quicktags( { 
																id: editor_id, 
																buttons: 'strong,em,link,block,del,ins,img,ul,ol,li,code,close' 
															} );
		WPV_Toolset.add_qt_editor_buttons( WPV_Toolset.CodeMirror_instance_qt[ editor_id ], WPV_Toolset.CodeMirror_instance[ editor_id ] );
		// Add Codemirror keymap shortcuts
		WPV_Toolset.CodeMirror_instance[ editor_id ].addKeyMap( self.editor_keymap );
		
	};
	
	/**
	 * Instantiate a Codemirror editor based on its ID.
	 *
	 * Generates the Codemirror instance, caches the editor value. No quicktags or keymap shortcuts here.
	 *
	 * @since 2.3.0
	 */
	
	self.init_codemirror_auxiliar_editor = function( editor_id, mode ) {
		
		mode = ( typeof mode === "undefined" ) ? "myshortcodes" : mode;
		
		// Instantiate Codemirror
		WPV_Toolset.CodeMirror_instance[ editor_id ]		= icl_editor.codemirror( editor_id, true, mode );
		// Cache the editor value
		WPV_Toolset.CodeMirror_instance_value[ editor_id ]	= WPV_Toolset.CodeMirror_instance[ editor_id ].getValue();
		
	};
	
	/**
	 * Delete a Codemirror instance, including its cached value, and maybe its Quicktags instance too.
	 *
	 * @since 2.3.0
	 */
	
	self.delete_codemirror_editor = function( editor_id ) {
		if ( _.has( WPV_Toolset.CodeMirror_instance, editor_id ) ) {
			WPV_Toolset.CodeMirror_instance[ editor_id ].focus();
			delete WPV_Toolset.CodeMirror_instance[ editor_id ];
			delete WPV_Toolset.CodeMirror_instance_value[ editor_id ];
			// Delete it from the iclCodeMirror collection
			delete window.iclCodemirror[ editor_id ];
			// Maybe delete de Quicktags instance
			if ( _.has( WPV_Toolset.CodeMirror_instance_qt, editor_id ) ) {
				delete WPV_Toolset.CodeMirror_instance_qt[ editor_id ];
			}
		}
	};

	self.init = function() {
		
		self.init_hooks()
			.init_main_editors();

	};
	
	self.init();

};

jQuery( document ).ready( function( $ ) {
    WPViews.edit_screen_editors = new WPViews.EditScreenEditors( $ );
});

WPViews.EditScreenOptions = function( $ ) {
	
	var self = this;
	
	// ---------------------------------
	// Model
	// ---------------------------------
	
	self.view_id				= $('.js-post_ID').val();
	self.model					= {};
	self.purpose_to_sections	= {
		all:		{
			visible:	[ 'content-filter' ],
			hidden:		[ 'filter-extra-parametric', 'filter-extra', 'content' ]
		},
		parametric:	{
			visible:	[ 'content-filter', 'filter-extra-parametric', 'filter-extra' ],
			hidden:		[ 'content' ]
		}
	};
	
	/**
	* init_model
	*
	* Init track of sections that need to be manually updated.
	* Does not include editors
	*
	* @since 2.1
	*/
	
	self.init_model = function() {
		self.model['purpose']					= $( '.js-wpv-purpose' ).val();
		self.model['visible']					= $( '.js-wpv-screen-options:checked' ).map( function() {
														return $( this ).val();
													}).get();
		self.model['hidden']					= $( '.js-wpv-screen-options:not(:checked)' ).map( function() {
														return $( this ).val();
													}).get();
		return self;
	};
	
	// ---------------------------------
	// Save
	// ---------------------------------
	
	self.save_screen_options = function() {
		var container = $( '.js-wpv-screen-options-wrapper' ),
		options_visible = $( '.js-wpv-screen-options:checked' ).map( function() {
				return $( this ).val();
			}).get(),
		options_hidden = $( '.js-wpv-screen-options:not(:checked)' ).map( function() {
				return $( this ).val();
			}).get(),
		purpose = container.find('.js-wpv-purpose').val();
		container.find('.toolset-alert').remove();
		if ( 
			self.model['purpose'] != purpose 
			|| self.model['visible'] != options_visible
			|| self.model['hidden'] != options_hidden
		) {
			var data = {
				action:		'wpv_save_screen_options',
				id:			self.view_id,
				purpose:	purpose,
				visible:	options_visible,
				hidden:		options_hidden,
				wpnonce:	wpv_editor_strings.screen_options.nonce
			};
			$.ajax({
				type:		"POST",
				dataType: 	"json",
				url:		ajaxurl,
				data:		data,
				success:	function( response ) {
					if ( response.success ) {
						self.model['purpose']	= purpose;
						self.model['visible']	= options_visible;
						self.model['hidden']	= options_hidden;
						$( document ).trigger( 'js_event_wpv_screen_options_saved' );
					} else {
						//self.manage_action_bar_error( response.data );
					}
				},
				error:		function( ajaxContext ) {
					
				},
				complete:	function() {
					
				}
			});
		}
		return self;
	};
	
	self.screen_options_debounce_update = _.debounce( self.save_screen_options, 1000 );
	
	// ---------------------------------
	// Screen options
	// ---------------------------------
	
	self.init_screen_options = function() {
		var views_screen_options_container = $( '#js-screen-meta-dup > div#js-screen-options-wrap-dup' );
		$( '#screen-options-wrap' )
			.addClass( 'wpv-screen-options-wrapper js-wpv-screen-options-wrapper' )
			.html( views_screen_options_container.html() );
		views_screen_options_container.remove();
		return self;
	};
	
	/**
	 * Manage edit page sections dependency and ability to be shown/hidden.
	 *
	 * @since unknown
	 * @since 2.3.0 Remove dependencies when hiding sections: we will only force "in" sections that depend on others
	 */
	
	self.validate_screen_options = function( changed ) {
		// First, validate against unsaved sections
		$( '.js-wpv-screen-options:not(:checked)' ).each( function() {
			var thiz_inner = $( this );
			if ( $('.js-wpv-settings-' + thiz_inner.val() ).find('.js-wpv-section-unsaved').length > 0 ) {
				thiz_inner.prop( 'checked', true );
				$('.js-wpv-screen-options-wrapper .js-wpv-toolset-messages')
					.wpvToolsetMessage({
						text:	wpv_editor_strings.screen_options.can_not_hide,
						type:	'error',
						inline:	true,
						stay:	true
					});
			}
		});
		// Now, specific dependencies
		if ( 
			changed.val() == 'filter-extra-parametric' 
			&& changed.prop( 'checked' ) 
			&& ! $( '.js-wpv-show-hide-filter-extra' ).prop( 'checked' ) 
		) {
			// If enabling the Custom Search Settings, force enable the Filter Editor
			// Since 2.3.0 we no longer forbid unchecking the Filter Editor if the Custom Search Settings is enabled
			$( '.js-wpv-show-hide-filter-extra' ).prop( 'checked', true );
			$('.js-wpv-screen-options-wrapper .js-wpv-toolset-messages')
				.wpvToolsetMessage({
					text:	wpv_editor_strings.screen_options.parametric_search_needs_filter,
					type:	'info',
					inline:	true,
					stay:	true
				});
		} else if (
			changed.val() == 'filter-extra' 
			&& changed.prop( 'checked' ) 
			&& ! $( '.js-wpv-show-hide-filter-extra-parametric' ).prop( 'checked' ) 
		) {
			// If enabling the Filter Editor, force enable the Custom Search Settings
			// Since 2.3.0 we no longer forbid unchecking the Custom Search Settings if the Filter Editor is enabled
			$( '.js-wpv-show-hide-filter-extra-parametric' ).prop( 'checked', true );
			$('.js-wpv-screen-options-wrapper .js-wpv-toolset-messages')
				.wpvToolsetMessage({
					text:	wpv_editor_strings.screen_options.filter_needs_parametric_search,
					type:	'info',
					inline:	true,
					stay:	true
				});
		}
		return self;
	};
	
	self.apply_screen_options = function() {
		$( '.js-wpv-screen-options:checked' ).each( function() {
			var thiz_inner_val = $( this ).val();
			$( '.js-wpv-settings-' + thiz_inner_val ).fadeIn( 'fast', function() {
				if ( thiz_inner_val == 'filter-extra' ) {
					WPV_Toolset.CodeMirror_instance['wpv_filter_meta_html_content'].refresh();
					WPV_Toolset.CodeMirror_instance['wpv_filter_meta_html_css'].refresh();
					WPV_Toolset.CodeMirror_instance['wpv_filter_meta_html_js'].refresh();
				} else if ( thiz_inner_val == 'layout-extra' ) {
					WPV_Toolset.CodeMirror_instance['wpv_layout_meta_html_content'].refresh();
					WPV_Toolset.CodeMirror_instance['wpv_layout_meta_html_css'].refresh();
					WPV_Toolset.CodeMirror_instance['wpv_layout_meta_html_js'].refresh();
				} else if ( thiz_inner_val == 'content' ) {
					WPV_Toolset.CodeMirror_instance['wpv_content'].refresh();
				}
			});
		});
		$( '.js-wpv-screen-options:not(:checked)' ).each( function() {
			var thiz_inner_val = $( this ).val();
			$( '.js-wpv-settings-' + thiz_inner_val ).hide();
		});
		return self;
	};
	
	self.manage_metasections = function() {
		$( '.js-wpv-screen-options-metasection' ).each( function() {
			var thiz_metasection_container = $( this ),
			thiz_metasection = thiz_metasection_container.data( 'metasection' );
			if ( thiz_metasection_container.find( '.js-wpv-screen-options:checked' ).length > 0 ) {
				$( '.' + thiz_metasection ).show();
			} else {
				$( '.' + thiz_metasection ).fadeOut( 'fast' );
			}
		});
		return self;
	};
	
	$( document ).on( 'change', '.js-wpv-screen-options', function() {
		var thiz = $( this );
		self
			.validate_screen_options( thiz )
			.apply_screen_options()
			.manage_metasections()
			.screen_options_debounce_update();
	});
	
	// ---------------------------------
	// Purpose management
	// ---------------------------------
	
	self.set_purpose_sections = function( purpose ) {
		_.each( self.purpose_to_sections[ purpose ].visible, function( element, index, list ) {
			$( '.js-wpv-show-hide-' + element + ':not(:checked)' )
				.prop( 'checked', true )
				.addClass( 'wpv-screen-options-changing' );
		});
		_.each( self.purpose_to_sections[ purpose ].hidden, function( element, index, list ) {
			$( '.js-wpv-show-hide-' + element + ':checked' )
				.prop( 'checked', false )
				.addClass( 'wpv-screen-options-changing' );
		});
		setTimeout( function () {
			$( '.js-wpv-screen-options' ).removeClass( 'wpv-screen-options-changing' );
		}, 1000 );
		return self;
	};
	
	$( document ).on( 'change', '.js-wpv-purpose', function() {
		self
			.set_purpose_sections( $( this ).val() )
			.apply_screen_options()
			.manage_metasections()
			.screen_options_debounce_update();
	});
	
	self.get_view_purpose = function( purpose ) {
		return self.model['purpose'];
	};
	
	// ---------------------------------
	// Init hooks
	// ---------------------------------
	
	self.init_hooks = function() {
		// Filter to get current View purpose
		Toolset.hooks.addFilter( 'wpv-filter-wpv-edit-screen-get-purpose', self.get_view_purpose );
		
		return self;
	};
	
	// ---------------------------------
	// Pointer
	// ---------------------------------
	
	self.init_pointer = function() {
		if ( $( '.js-wpv-set-wpa-purpose-pointer' ).length > 0 ) {
			self.screen_options_pointer = $('#screen-options-link-wrap').pointer({
				pointerClass:	'wp-toolset-pointer wp-toolset-views-pointer js-wp-toolset-views-set-wpa-purpose-pointer',
				pointerWidth:	400,
				content:		$( '.js-wpv-set-wpa-purpose-pointer' ).html(),
				position:		{
					edge:	'top',
					align:	'right'
				},
				buttons:		function( event, t ) {
					var button_close = $('<button class="button button-primary-toolset alignright js-wpv-close-this">' + wpv_editor_strings.pointer.close + '</button>');
					button_close.bind( 'click.pointer', function( e ) {
						e.preventDefault();
						if ( t.pointer.find( '.js-wpv-dismiss-pointer:checked' ).length > 0 ) {
							var pointer_name = t.pointer.find( '.js-wpv-dismiss-pointer:checked' ).data( 'pointer' );
							$( document ).trigger( 'js_event_wpv_dismiss_pointer', [ pointer_name ] );
						}
						t.element.pointer( 'close' );
					});
					return button_close;
				}
			});
			// Now, let's move the arrow to the right of the top side
			$( '.js-wp-toolset-views-set-wpa-purpose-pointer .wp-pointer-arrow' ).css({
				'right':	'50px',
				'left':		'auto'
			});
			if ( ! $( '.js-wpv-set-wpa-purpose-pointer' ).hasClass( 'js-wpv-pointer-dismissed' ) ) {
				self.screen_options_pointer.pointer('open');
				$( document ).on( 'click', '#screen-options-link-wrap', function() {
					self.screen_options_pointer.pointer( 'close' );
				});
			}
		}
		return self;
	};
	
	// ---------------------------------
	// Init
	// ---------------------------------
	
	self.init = function() {
		self
			.init_screen_options()
			.init_model()
			.init_hooks()
			.manage_metasections()
			.init_pointer();
	};
	
	self.init();

};

jQuery( document ).ready( function( $ ) {
    WPViews.edit_screen_options = new WPViews.EditScreenOptions( $ );
});

WPViews.WPAEditScreen = function( $ ) {
	
	var self = this;
	
	self.get_view_query_mode = function() {
		return 'archive';
	};
	
	self.get_post_relationship_tree_reference = function() {
		if ( typeof WPViews.wpv_post_relationship_tree_reference === "undefined" ) {
			return {};
		}
		return WPViews.wpv_post_relationship_tree_reference;
	};
	
	// ---------------------------------
	// Model
	// ---------------------------------
	
	self.view_id			= $('.js-post_ID').val();
	self.model				= {};
	
	self.get_view_id = function() {
		return self.view_id;
	};
	
	/**
	* init_model
	*
	* Init track of sections that need to be manually updated.
	* Does not include editors
	*
	* @since 2.1
	* @since 2.3.1 Add a "sorting" element to the model.
	*/
	self.init_model = function() {
		self.model['.js-wpv-title']						= $( '.js-title' ).val();
		self.model['.js-wpv-description']				= $( '.js-wpv-description' ).val();
		
		self.model['js-wpv-query-type']					= 'posts';
		
		self.model['.js-wpv-layout-settings-extra-js']	= $( '.js-wpv-layout-settings-extra-js' ).val();
		
		self.model['sorting']							= {
															posts:		{
																orderby:			$( 'select.js-wpv-posts-orderby' ).val(),
																orderby_as:			$( 'select.js-wpv-posts-orderby-as' ).val(),
																order:				$( 'select.js-wpv-posts-order' ).val(),
																orderby_secondary:	$( 'select.js-wpv-posts-orderby-second' ).val(),
																order_secondary:	$( 'select.js-wpv-posts-order-second' ).val()
															}
														};
		
		return self;
	};
	
	self.get_view_query_type = function() {
		return self.model['js-wpv-query-type'];
	};
	
	// ---------------------------------
	// Frontend events
	// ---------------------------------
	
	self.frontend_events_comments = {
		js_event_wpv_pagination_completed: "\n\t/**" 
				+ "\n\t* data.view_unique_id " + wpv_editor_strings.event_trigger_callback_comments.view_unique_id
				+ "\n\t* data.effect " + wpv_editor_strings.event_trigger_callback_comments.effect
				+ "\n\t* data.speed " + wpv_editor_strings.event_trigger_callback_comments.speed
				+ "\n\t* data.layout " + wpv_editor_strings.event_trigger_callback_comments.layout
				+ "\n\t*/",
		js_event_wpv_parametric_search_triggered: "\n\t/**" 
				+ "\n\t* data.view_unique_id " + wpv_editor_strings.event_trigger_callback_comments.view_unique_id
				+ "\n\t* data.form " + wpv_editor_strings.event_trigger_callback_comments.form
				+ "\n\t* data.update_form " + wpv_editor_strings.event_trigger_callback_comments.update_form
				+ "\n\t* data.update_results " + wpv_editor_strings.event_trigger_callback_comments.update_results
				+ "\n\t*/",
		js_event_wpv_parametric_search_started: "\n\t/**" 
				+ "\n\t* data.view_unique_id " + wpv_editor_strings.event_trigger_callback_comments.view_unique_id
				+ "\n\t*/",
		js_event_wpv_parametric_search_form_updated: "\n\t/**" 
				+ "\n\t* data.view_unique_id " + wpv_editor_strings.event_trigger_callback_comments.view_unique_id
				+ "\n\t* data.view_changed_form " + wpv_editor_strings.event_trigger_callback_comments.form_updated
				+ "\n\t* data.view_changed_form_additional_forms_only " + wpv_editor_strings.event_trigger_callback_comments.view_changed_form_additional_forms_only
				+ "\n\t* data.view_changed_form_additional_forms_full " + wpv_editor_strings.event_trigger_callback_comments.view_changed_form_additional_forms_full
				+ "\n\t*/",
		js_event_wpv_parametric_search_results_updated: "\n\t/**" 
				+ "\n\t* data.view_unique_id " + wpv_editor_strings.event_trigger_callback_comments.view_unique_id
				+ "\n\t* data.layout " + wpv_editor_strings.event_trigger_callback_comments.layout
				+ "\n\t*/"
	};
	
	// ---------------------------------
	// Helpers
	// ---------------------------------
	
	self.overlay_container = $("<div class='wpv-setting-overlay js-wpv-setting-overlay'><div class='wpv-transparency'></div><i class='icon-lock fa fa-lock'></i></div>");
	
	self.dialog_minWidth = 870;
	
	self.calculate_dialog_maxWidth = function() {
		return ( $( window ).width() - 100 );
	};
	
	self.calculate_dialog_maxHeight = function() {
		return ( $( window ).height() - 100 );
	};
	
	$( document ).on( 'click', '.js-wpv-disable-events', function( e ) {
		e.preventDefault();
		return false;
	});
	
	self.apply_post_types_to_loop_data = {
		type:			'',
		name:			'',
		'default_pt':	[],
		'selected_pt':	[]
	};
	
	self.codemirror_highlight_options = {
		className: 'wpv-codemirror-highlight'
	};
	
	self.sanitize_arbitrary_shortcode_value = function( value ) {
		value = value.replace( /\"/gi, '%%QUOTE%%' );
		value = value.replace( /\'/gi, '%%SQUOTE%%' );
		value = value.replace( /\[/gi, '%%OBRAK%%' );
		value = value.replace( /\]/gi, '%%CBRAK%%' );
		return value;
	};
	
	// ---------------------------------
	// Save queue
	// ---------------------------------
	
	/**
	* Store sections to be manually updatd on a queue.
	*
	* @since 2.1
	*/
	
	self.save_queue					= [];
	self.save_fail_queue			= [];
	self.save_callbacks				= {};
	self.save_section_defaults		= {
		callback:	self.save_section_defaults_callback,
		event:		'js_event_wpv_save_section_defaults_completed'
	};
	self.save_all_queue_step		= 0;
	self.save_all_queue_completed	= 100;
	self.save_all_progress_bar		= $( '#js-wpv-general-actions-bar .js-wpv-view-save-all-progress' );
	
	/**
	* save_section_defaults_callback
	*
	* Default callback and event to fire when saving a section.
	* This is usually overriden by each section data.
	*
	* @since 2.1
	*/
	
	self.save_section_defaults_callback = function( event, propagate ) {
		$( document ).trigger( event );
		if ( propagate ) {
			$( document ).trigger( 'js_wpv_save_section_queue' );
		} else {
			$( document ).trigger( 'js_event_wpv_set_confirmation_unload_check' );
		}
	};
	
	/**
	* manage_save_queue
	*
	* Add or remove a section from the save queue.
	*
	* @since 2.1
	*/
	
	self.manage_save_queue = function( section, action, args ) {
		if ( typeof args === 'undefined' ) {
			args = {};
		}
		var target = { 
			section:	section, 
			args:		args 
		};
		switch ( action ) {
			case 'add':
				self.save_queue.push( target );
				self.save_queue = _.uniq( self.save_queue, function( item, key, a ) { 
					return item.section + '#' + _.keys( item.args ).join( '#' ) + '#' + _.values( item.args ).join( '#' );
				});
				break;
			case 'remove':
				self.save_queue = _.filter( self.save_queue, function( item ) {
					return ! _.isEqual( item, target );
				});
				break;
		}
		self.save_fail_queue = _.without( self.save_fail_queue, section );
	};
	
	/**
	* modify_save_queue
	*
	* Add or remove a section from the save queue, using a Toolset.hook.
	*
	* @since 2.1
	*/
	
	self.modify_save_queue = function( data ) {
		var safe_data = $.extend( {}, { section: '', action: '', args: {} }, data );
		if (
			'' != safe_data.section 
			&& '' != safe_data.action
		) {
			self.manage_save_queue( safe_data.section, safe_data.action, safe_data.args );
		}
	};
	
	/**
	* define_save_callbacks
	*
	* Add or remove a callback to be used by the save queue, using a Toolset.hook.
	*
	* @since 2.1
	*/
	
	self.define_save_callbacks = function( data ) {
		self.save_callbacks[ data.handle ] = {
			callback:	data.callback,
			event:		data.event
		};
	};
	
	/**
	* modify_save_fail_queue
	*
	* Add a section from the save fail queue, using a Toolset.hook.
	*
	* @since 2.1
	*/
	
	self.modify_save_fail_queue = function( section ) {
		self.save_fail_queue.push( section );
	};
	
	/**
	* Process save queue, one item at a time.
	*
	* @since 2.1
	*/
		
	$( document ).on( 'js_wpv_save_section_queue', function( event ) {
		if ( _.size( self.save_queue ) > 0 ) {
			
			if ( self.save_all_queue_step > 0 ) {
				self.save_all_progress_bar.addClass( 'wpv-view-save-all-progress-working' );
				if ( self.save_all_queue_completed >= 100 ) {
					self.save_all_queue_completed = 0;
				} else {
					self.save_all_queue_completed += self.save_all_queue_step;
					
				}
				self.save_all_progress_bar.css({
					'width': self.save_all_queue_completed + '%'
				});
			}
			
			var save_section_to_fire = _.first( self.save_queue ),
			save_section_to_fire_data = _.has( self.save_callbacks, save_section_to_fire.section ) ? self.save_callbacks[ save_section_to_fire.section ]: self.save_section_defaults;
			if ( typeof save_section_to_fire_data.callback == "function" ) {
				save_section_to_fire_data.callback( save_section_to_fire_data.event, true, save_section_to_fire.args );
			}
		} else {
			$( document ).trigger( 'js_event_wpv_set_confirmation_unload_check' );
			$( document ).trigger( 'js_wpv_save_section_queue_completed' );
		}
	});
	
	// ---------------------------------
	// Action Bar
	// ---------------------------------
	
	self.action_bar						= $( '#js-wpv-general-actions-bar' );
	self.action_bar_message_container	= $( '#js-wpv-general-actions-bar .js-wpv-message-container' );
	self.html							= $( 'html' );
	
	if ( self.action_bar && self.action_bar.offset() ) {
		var toolbarPos = self.action_bar.offset().top,
		adminBarHeight = 0,
		adminBarWidth = $( '.wpv-title-section .wpv-setting-container' ).width();
		if ( $('#wpadminbar').length !== 0 ) {
			adminBarHeight = $('#wpadminbar').height();
			self.action_bar.width( adminBarWidth );
		}
		self.set_toolbar_pos = function() {
			if ( toolbarPos <= $(window).scrollTop() + adminBarHeight + 15) {
				self.html.addClass('wpv-general-actions-bar-fixed');
			}
			else {
				self.html.removeClass('wpv-general-actions-bar-fixed');
			}
		};

		$( window ).on( 'scroll', function() {
			self.set_toolbar_pos();
		});
		
		$( window ).on( 'resize', function() {
			var adminBarWidth = $( '.wpv-title-section .wpv-setting-container' ).width();
			self.action_bar.width( adminBarWidth );
		});

		self.set_toolbar_pos();
	}
	
	// ---------------------------------
	// Init hooks
	// ---------------------------------
	
	self.init_hooks = function() {
		
		/**
		* Filters
		*/
		
		// Filter to get current View 
		Toolset.hooks.addFilter( 'wpv-filter-wpv-edit-screen-get-query-mode', self.get_view_query_mode );
		
		// Filter to get current View ID
		Toolset.hooks.addFilter( 'wpv-filter-wpv-edit-screen-get-id', self.get_view_id );
		
		// Filter to get current View query type
		Toolset.hooks.addFilter( 'wpv-filter-wpv-edit-screen-get-query-type', self.get_view_query_type );
		
		// Filter to get the Types post relationship tree reference, stored in WPViews.wpv_post_relationship_tree_reference
		Toolset.hooks.addFilter( 'wpv-filter-wpv-edit-screen-get-post-relationship-tree-reference', self.get_post_relationship_tree_reference );
		
		/**
		* Actions
		*/
		
		// Action to execute self.trigger_ajax_fail, a wrapper for self.manage_ajax_fail
		Toolset.hooks.addAction( 'wpv-action-wpv-edit-screen-manage-ajax-fail', self.trigger_ajax_fail );
		
		// Action to execute self.set_confirm_unload
		Toolset.hooks.addAction( 'wpv-action-wpv-edit-screen-set-confirm-unload', self.set_confirm_unload );
		
		// Action to add or remove from the save queue
		Toolset.hooks.addAction( 'wpv-action-wpv-edit-screen-manage-save-queue', self.modify_save_queue );
		
		// Action to add or remove from the save callbacks
		Toolset.hooks.addAction( 'wpv-action-wpv-edit-screen-define-save-callbacks', self.define_save_callbacks );
		
		// Action to add or remove from the save fail queue
		Toolset.hooks.addAction( 'wpv-action-wpv-edit-screen-manage-save-fail-queue', self.modify_save_fail_queue );
		
		// Action to refresh a CodeMirror instance
		Toolset.hooks.addAction( 'wpv-action-wpv-edit-screen-refresh-codemirror-instances', self.refresh_codemirror_instances );
		
		// Action to adjust the sorting section, pero query type
		Toolset.hooks.addAction( 'wpv-action-wpv-edit-screen-adjust-sorting-section', self.adjust_sorting_section );
		
	};
	
	// ---------------------------------
	// Init cache
	// ---------------------------------
	
	/**
	 * Cache for repeating expensive structures.
	 *
	 * @since 2.3.0
	 */
	self.cache = {
		'sorting_options': {
			posts:		{}
		}
	};
	
	/**
	 * Init cached structures.
	 *
	 * @since 2.3.0 Add cache for sorting options, used in several interfaces.
	 */
	self.init_cache = function() {
		
		/**
		 * Cache orderby options for the sorting controls dialog
		 */
		
		var orderby_option = null;
		
		$( 'select.js-wpv-posts-orderby option' ).each( function () {
			
			orderby_option = $( this );
			
			self.cache['sorting_options'].posts[ orderby_option.attr( 'value' ) ] = {
				value:	orderby_option.attr( 'value' ),
				title:	orderby_option.text(),
				type:	''
			};
			
			if ( 
				'field-' == orderby_option.attr( 'value' ).substr( 0, 6 ) 
				&& orderby_option.data( 'field-type' ) !== undefined
			) {
				self.cache['sorting_options'].posts[ orderby_option.attr( 'value' ) ].type	= orderby_option.data( 'field-type' );
			}
			
		});
		
	};
	
	// ---------------------------------
	// CodeMirror settings
	// ---------------------------------
	
	self.init_codemirror = function() {
		
		WPV_Toolset.CodeMirror_instance['wpv_filter_meta_html_content'].on('change', function(){
			self.codemirror_filter_editors_track();
		});
		
		WPV_Toolset.CodeMirror_instance['wpv_filter_meta_html_css'].on('change', function(){
			self.codemirror_filter_editors_track();
		});
		
		WPV_Toolset.CodeMirror_instance['wpv_filter_meta_html_js'].on('change', function(){
			self.codemirror_filter_editors_track();
		});
		
		WPV_Toolset.CodeMirror_instance['wpv_layout_meta_html_content'].on( 'change', function() {
			self.codemirror_layout_editors_track();
		});
		
		WPV_Toolset.CodeMirror_instance['wpv_layout_meta_html_css'].on( 'change', function() {
			self.codemirror_layout_editors_track();
		});
		
		WPV_Toolset.CodeMirror_instance['wpv_layout_meta_html_js'].on( 'change', function() {
			self.codemirror_layout_editors_track();
		});
		
		WPV_Toolset.CodeMirror_instance['wpv_content'].on( 'change', function() {
			self.codemirror_content_track();
		});
		
		CodeMirror.commands.save = function(cm) {
			// Prevent Firefox trigger Save Dialog
			var keypress_handler = function (cm, event) {
				if (event.which == 115 && (event.ctrlKey || event.metaKey) || (event.which == 19)) {
					event.preventDefault();
					return false;
				}
				return true;
			};
			CodeMirror.off(cm.getWrapperElement(), 'keypress', keypress_handler);
			cm.on('keypress', keypress_handler);
			
			var textarea_id = cm.getTextArea().id;
			if (
					textarea_id === 'wpv_filter_meta_html_content' ||
					textarea_id === 'wpv_filter_meta_html_css' ||
					textarea_id === 'wpv_filter_meta_html_js'
					) {
				/* Filter */
				$('.js-wpv-filter-extra-update').click();
			} else if (
					textarea_id === 'wpv_layout_meta_html_content' ||
					textarea_id === 'wpv_layout_meta_html_css' ||
					textarea_id === 'wpv_layout_meta_html_js'
					) {
				/* Loop Output */
				$('.js-wpv-layout-extra-update').click();
			} else if (
					textarea_id === 'wpv_content'
					) {
				/* Filter and Loop Output Integration */
				$('.js-wpv-content-update').click();
			}
		};
		// Autoresize setting
		if ( 
			wpv_editor_strings.codemirror_autoresize == 'true' 
			|| wpv_editor_strings.codemirror_autoresize == '1' 
		) {
			$( '.CodeMirror' ).css( 'height', 'auto' );
			$( '.CodeMirror-scroll' ).css( {'overflow-y':'hidden', 'overflow-x':'auto', 'min-height':'15em'} );
		}
		// Refresh CodeMirror instances
		Toolset.hooks.doAction( 
			'wpv-action-wpv-edit-screen-refresh-codemirror-instances', 
			[ 
				'wpv_filter_meta_html_content', 'wpv_filter_meta_html_css', 'wpv_filter_meta_html_js', 
				'wpv_layout_meta_html_content', 'wpv_layout_meta_html_css', 'wpv_layout_meta_html_js', 
				'wpv_content'
			] 
		);
		
	};
	
	self.refresh_codemirror_instances = function( instances ) {
		_.each( instances, function( element, index, list ) {
			WPV_Toolset.CodeMirror_instance[ element ].refresh();
		});
	};
	
	self.refresh_codemirror = function( instance ) {
		if ( instance === 'all' ) {
			WPV_Toolset.CodeMirror_instance['wpv_filter_meta_html_content'].refresh();
			WPV_Toolset.CodeMirror_instance['wpv_filter_meta_html_css'].refresh();
			WPV_Toolset.CodeMirror_instance['wpv_filter_meta_html_js'].refresh();
			WPV_Toolset.CodeMirror_instance['wpv_layout_meta_html_content'].refresh();
			WPV_Toolset.CodeMirror_instance['wpv_layout_meta_html_css'].refresh();
			WPV_Toolset.CodeMirror_instance['wpv_layout_meta_html_js'].refresh();
			WPV_Toolset.CodeMirror_instance['wpv_content'].refresh();
		} else {
			if ( instance == 'filter-css-editor' ) {
				WPV_Toolset.CodeMirror_instance['wpv_filter_meta_html_css'].refresh();
			} else if ( instance == 'filter-js-editor' ) {
				WPV_Toolset.CodeMirror_instance['wpv_filter_meta_html_js'].refresh();
			} else if ( instance == 'layout-css-editor' ) {
				WPV_Toolset.CodeMirror_instance['wpv_layout_meta_html_css'].refresh();
			} else if ( instance == 'layout-js-editor' ) {
				WPV_Toolset.CodeMirror_instance['wpv_layout_meta_html_js'].refresh();
			}
		}
	};
	
	// ---------------------------------
	// Save actions: error and success
	// ---------------------------------
	
	self.trigger_ajax_fail = function( args ) {
		self.manage_ajax_fail( args.data, args.container );
	}
	
	self.manage_ajax_fail = function( data, message_container ) {
		if ( data.type ) {
			switch ( data.type ) {
				case 'nonce':
				case 'id':
				case 'capability':
					self.manage_action_bar_error( data );
					Toolset.hooks.doAction( 'wpv-action-wpv-edit-screen-set-confirm-unload', false );
					$( '.wpv-setting-container:not(.js-wpv-general-actions-bar)' ).prepend( self.overlay_container );
					break;
				default:
					if ( data.message ) {
						message_container
							.wpvToolsetMessage({
								text: data.message,
								type: 'error',
								inline: true,
								stay: true
							});
					}
					break;
			}
		} else {
			if ( data.message ) {
				message_container
					.wpvToolsetMessage({
						text: data.message,
						type: 'error',
						inline: true,
						stay: true
					});
			}
		}
	};
	
	self.manage_ajax_success = function( data, message_container ) {
		if ( data.message ) {
			message_container
				.wpvToolsetMessage({
					text: data.message,
					type: 'success',
					inline: true,
					stay: false
				});
		}
	};

    self.manage_action_bar_success = function( data ) {
        if ( data.message ) {
            self.action_bar_message_container
                .wpvToolsetMessage({
                    text: data.message,
                    type: 'success',
                    inline: false,
                    stay: false
                });
        }
    };
	
	self.manage_action_bar_error = function( data ) {
		if ( data.message ) {
            var stay = (typeof(data.stay) != 'undefined') ? data.stay : true;
			self.action_bar_message_container
				.wpvToolsetMessage({
					text: data.message,
					type: 'error',
					inline: false,
					stay: stay
				});
		}
	};
	
	// ---------------------------------
	// Title and description
	// ---------------------------------
	
	// Title placeholder
	
	self.title_placeholder = function() {
		$( '.js-title' ).each( function() {
			var thiz = $( this );
			if ( '' == thiz.val() ) {
				thiz
					.parents( '.js-wpv-titlewrap' )
						.find( '.js-title-reader' )
							.removeClass( 'screen-reader-text' );
			}
			thiz.focus( function() {
				thiz
					.parents( '.js-wpv-titlewrap' )
						.find( '.js-title-reader' )
							.addClass( 'screen-reader-text' );
			});
			thiz.blur( function() {
				if ( '' == thiz.val() ) {
					thiz
						.parents( '.js-wpv-titlewrap' )
							.find( '.js-title-reader' )
								.removeClass( 'screen-reader-text' );
				}
			thiz.focus( function() {
				thiz
					.parents( '.js-wpv-titlewrap' )
						.find( '.js-title-reader' )
							.addClass( 'screen-reader-text' );
			});
			thiz.blur( function() {
				if ( '' == thiz.val() ) {
					thiz
						.parents( '.js-wpv-titlewrap' )
							.find( '.js-title-reader' )
								.removeClass( 'screen-reader-text' );
				}
			});
			});
		});
	};
	
	// Title: track and save
	
	self.title_track_callback = function() {
		$( '#titlediv' ).find( '.toolset-alert' ).remove();
		$( '.js-wpv-title-update' ).parent().find( '.toolset-alert-error' ).remove();
		if ( self.model['.js-wpv-title'] != $( '.js-title' ).val() ) {
			self.manage_save_queue( 'save_section_title', 'add' );
			$( '.js-wpv-title-update' )
				.prop('disabled', false)
				.removeClass('button-secondary')
				.addClass('button-primary js-wpv-section-unsaved');
			Toolset.hooks.doAction( 'wpv-action-wpv-edit-screen-set-confirm-unload', true );
		} else {
			self.manage_save_queue( 'save_section_title', 'remove' );
			$( '.js-wpv-title-update' )
				.prop('disabled', true)
				.removeClass('button-primary js-wpv-section-unsaved')
				.addClass('button-secondary');
			$( document ).trigger( 'js_event_wpv_set_confirmation_unload_check' );
		}
	};
	
	self.title_track = _.debounce( self.title_track_callback, 100 );
	
	$( document ).on( 'keyup input cut paste', '.js-title', function() {
		self.title_track();
	});
	
	self.save_section_title = function( event, propagate ) {
		var thiz = $( '.js-wpv-title-update' ),
		thiz_container = thiz.parents( '.js-wpv-settings-title-and-desc' ),
		thiz_message_container = thiz_container.find( '.js-wpv-message-container' ),
		unsaved_message = thiz.data('unsaved'),
		nonce = thiz.data('nonce'),
		spinnerContainer = $('<div class="wpv-spinner ajax-loader">').insertBefore( thiz ).show();
		
		self.manage_save_queue( 'save_section_title', 'remove' );
		
		thiz_container.find('.toolset-alert-error').remove();
		thiz
			.prop( 'disabled', true )
			.removeClass( 'button-primary' )
			.addClass( 'button-secondary' );
		
		var titleOriginal = $('.js-title').val(),
		titleEscaped = titleOriginal.replace( /\'/gi, '' ),
		isTitleEscaped = true;
		
		titleEscaped = WPV_Toolset.Utils._strip_tags_and_preserve_text( _.unescape( titleEscaped ) );
		isTitleEscaped = ( titleOriginal != titleEscaped );

		var data = {
			action: 'wpv_update_title',
			id: self.view_id,
			title: titleEscaped,
			is_title_escaped: isTitleEscaped ? 1 : 0,
			wpnonce: nonce
		};

		$.ajax({
			type:		"POST",
			dataType: 	"json",
			url:		ajaxurl,
			data:		data,
			success:	function( response ) {
				if ( response.success ) {
					thiz.removeClass( 'js-wpv-section-unsaved' );
					self.model['.js-wpv-title'] = titleEscaped;
					$( '.js-title' ).val(titleEscaped);
					self.manage_ajax_success( response.data, thiz_message_container );
					$( document ).trigger( event );
					if ( propagate ) {
						$( document ).trigger( 'js_wpv_save_section_queue' );
					} else {
						$( document ).trigger( 'js_event_wpv_set_confirmation_unload_check' );
					}
				} else {
					Toolset.hooks.doAction( 'wpv-action-wpv-edit-screen-manage-ajax-fail', { data: response.data, container: thiz_message_container} );
					self.save_fail_queue.push( 'save_section_title' );
					if ( propagate ) {
						$( document ).trigger( 'js_wpv_save_section_queue' );
					}
					thiz
						.prop( 'disabled', false )
						.removeClass( 'button-secondary' )
						.addClass( 'button-primary' );
				}
			},
			error:		function( ajaxContext ) {
				thiz_message_container
					.wpvToolsetMessage({
						text:unsaved_message,
						type:'error',
						inline:true,
						stay:true
					});
				self.save_fail_queue.push( 'save_section_title' );
				if ( propagate ) {
					$( document ).trigger( 'js_wpv_save_section_queue' );
				}
				thiz
					.prop( 'disabled', false )
					.removeClass( 'button-secondary' )
					.addClass( 'button-primary' );
			},
			complete:	function() {
				spinnerContainer.remove();
			}
		});
	};
	
	self.save_callbacks['save_section_title'] = {
		callback:	self.save_section_title,
		event:		'js_event_wpv_save_section_title_completed'
	};
	
	$( document ).on( 'click', '.js-wpv-title-update', function( e ) {
		e.preventDefault();
		self.save_section_title( 'js_event_wpv_save_section_title_completed', false );
	});
	
	// Description: track and save
	
	$( '.js-wpv-description-toggle' ).on( 'click', function() {
		$( this ).hide();
		$( '.js-wpv-description-container' ).fadeIn( 'fast' );
		$( '#wpv-description' ).focus();
	});
	
	self.description_track_callback = function() {
		$( '.js-wpv-title-update' ).parent().find( '.toolset-alert-error' ).remove();
		if ( self.model['.js-wpv-description'] != $( '.js-wpv-description' ).val() ) {
			self.manage_save_queue( 'save_section_description', 'add' );
			$( '.js-wpv-description-update' )
				.prop('disabled', false)
				.removeClass('button-secondary')
				.addClass('button-primary js-wpv-section-unsaved');
			Toolset.hooks.doAction( 'wpv-action-wpv-edit-screen-set-confirm-unload', true );
		} else {
			self.manage_save_queue( 'save_section_description', 'remove' );
			$( '.js-wpv-description-update' )
				.prop('disabled', true)
				.removeClass('button-primary js-wpv-section-unsaved')
				.addClass('button-secondary');
			$( document ).trigger( 'js_event_wpv_set_confirmation_unload_check' );
		}
	};
	
	self.description_track = _.debounce( self.description_track_callback, 100 );
	
	$( document ).on( 'keyup input cut paste', '.js-wpv-description', function() {
		self.description_track();
	});
	
	self.save_section_description = function( event, propagate ) {
		var thiz = $( '.js-wpv-description-update' ),
		thiz_container = thiz.parents( '.js-wpv-settings-title-and-desc' ),
		thiz_message_container = thiz_container.find( '.js-wpv-message-container' ),
		//update_message = thiz.data('success'),
		unsaved_message = thiz.data('unsaved'),
		nonce = thiz.data('nonce'),
		spinnerContainer = $('<div class="wpv-spinner ajax-loader">').insertBefore( thiz ).show();
		
		self.manage_save_queue( 'save_section_description', 'remove' );
		
		thiz_container.find('.toolset-alert-error').remove();
		thiz
			.prop( 'disabled', true )
			.removeClass( 'button-primary' )
			.addClass( 'button-secondary' );

		var data = {
			action: 'wpv_update_description',
			id: self.view_id,
			description: $('.js-wpv-description').val(),
			wpnonce: nonce
		};


		$.ajax({
			type:		"POST",
			dataType:	"json",
			url:		ajaxurl,
			data:		data,
			success:	function( response ) {
				if ( response.success ) {
					thiz.removeClass( 'js-wpv-section-unsaved' );
					self.model['.js-wpv-description'] = $( '.js-wpv-description' ).val();
					self.manage_ajax_success( response.data, thiz_message_container );
					$( document ).trigger( event );
					if ( propagate ) {
						$( document ).trigger( 'js_wpv_save_section_queue' );
					} else {
						$( document ).trigger( 'js_event_wpv_set_confirmation_unload_check' );
					}
				} else {
					Toolset.hooks.doAction( 'wpv-action-wpv-edit-screen-manage-ajax-fail', { data: response.data, container: thiz_message_container} );
					self.save_fail_queue.push( 'save_section_description' );
					if ( propagate ) {
						$( document ).trigger( 'js_wpv_save_section_queue' );
					}
					thiz
						.prop( 'disabled', false )
						.removeClass( 'button-secondary' )
						.addClass( 'button-primary' );
				}
			},
			error:		function( ajaxContext ) {
				thiz_message_container
					.wpvToolsetMessage({
						text:unsaved_message,
						type:'error',
						inline:true,
						stay:true
					});
				self.save_fail_queue.push( 'save_section_description' );
				if ( propagate ) {
					$( document ).trigger( 'js_wpv_save_section_queue' );
				}
				thiz
					.prop( 'disabled', false )
					.removeClass( 'button-secondary' )
					.addClass( 'button-primary' );
			},
			complete:	function() {
				spinnerContainer.remove();
			}
		});
	};
	
	self.save_callbacks['save_section_description'] = {
		callback:	self.save_section_description,
		event:		'js_event_wpv_save_section_description_completed'
	};
	
	$( document ).on( 'click', '.js-wpv-description-update', function( e ) {
		e.preventDefault();
		self.save_section_description( 'js_event_wpv_save_section_description_completed', false );
	});
	
	// Slug: edit and update
	
	$( document ).on( 'click', '.js-wpv-edit-slug, #editable-post-name', function( e ) {
		$('.js-wpv-edit-slug-toggle').toggle();
		$('#wpv-slug').val($('#editable-post-name').html());
    });
	
	$( document ).on( 'click', '.js-wpv-edit-slug-cancel', function( e ) {
		$('.js-wpv-edit-slug-toggle').toggle();
		$('.js-wpv-slug-container .js-wpv-message-container-slug' ).html('');
		$( document ).trigger( 'js_event_wpv_set_confirmation_unload_check' );
	});
	
	$( document ).on( 'click', '.js-wpv-edit-slug-update', function( e ) {
		e.preventDefault();
		var thiz = $( this );
		var message_where = $( '.js-wpv-slug-container .js-wpv-message-container-slug' );
		var update_message = thiz.data( 'success' );
		var error_message = thiz.data( 'unsaved' );
		var data = {
			action:		'wpv_view_change_post_name',
			id:			self.view_id,
			post_name:	$('#wpv-slug').val(),
			wpnonce :	thiz.data( 'nonce' )
		};
		$.ajax({
			type:		"POST",
			url:		ajaxurl,
			data:		data,
			dataType:	"json",
			success: function( response ) {
				if (
					typeof( response ) !== 'undefined'
					&& typeof( response.success ) !== 'undefined'
					&& response.success
				) {
					$('.js-wpv-edit-slug-toggle').toggle();
					$('#editable-post-name').html( response.data.slug );
                    message_where.wpvToolsetMessage( 'wpvMessageRemove' );
				} else {
					message_where.wpvToolsetMessage({
						text: 'undefined' == typeof( response.data.message)? error_message:response.data.message,
						type:'error',
						inline:true,
						stay:true
					});
				}
			},
			error: function( ajaxContext ) {
				message_where.wpvToolsetMessage({
					text:error_message,
					type:'error',
					inline:true,
					stay:true
				});
			},
			complete: function() {
			}
		});
	});
	
	// Status: change

	$( document ).on( 'click', '.js-wpv-change-view-status', function( e ) {
		e.preventDefault();
		var thiz = $( this ),
		newstatus = thiz.data( 'statusto' ),
		spinnerContainer = $( '<div class="wpv-spinner ajax-loader">' ).insertAfter( thiz ).show(),
		update_message = thiz.data( 'success' ),
		error_message = thiz.data( 'unsaved' ),
		redirect_url = thiz.data( 'redirect' ),
		message_where = $( '.js-wpv-settings-title-and-desc .js-wpv-message-container' );
		thiz
			.prop( 'disabled', true )
			.removeClass( 'button-primary' )
			.addClass( 'button-secondary' );
		var data = {
			action:			'wpv_view_change_status',
			id:				self.view_id,
			newstatus:		newstatus,
			cleararchives:	( newstatus == 'trash' ) ? 1 : 0,
			wpnonce :		thiz.data( 'nonce' )
		};
		$.ajax({
			type:		"POST",
			url:		ajaxurl,
			data:		data,
			success:	function( response ) {
				if ( ( typeof( response ) !== 'undefined' ) && ( response == data.id ) ) {
					if ( newstatus == 'trash' ) {
						Toolset.hooks.doAction( 'wpv-action-wpv-edit-screen-set-confirm-unload', false );
						//WPViews.wpa_edit_screen.set_confirm_unload( false );
						$( location ).attr( 'href', redirect_url );
					}
				} else {
					message_where.wpvToolsetMessage({
						text:error_message,
						type:'error',
						inline:true,
						stay:true
					});
				}
			},
			error:		function( ajaxContext ) {
				thiz.prop( 'disabled', false );
				spinnerContainer.remove();
				message_where.wpvToolsetMessage({
					text:error_message,
					type:'error',
					inline:true,
					stay:true
				});
			},
			complete:	function() {
			  
			}
		});
	});
	
	// ---------------------------------
	// Loop selection
	// ---------------------------------
	
	self.init_loop_selection_help = function() {
		if ( $( '.js-loop-selection-form input:checked' ).length > 1 ) {
			$( '.js-wpv-multiple-archive-loops-selected' ).fadeIn( 'fast' );
		} else {
			$( '.js-wpv-multiple-archive-loops-selected' ).hide();
		}
	}
	
	$( document ).on( 'js_event_wpv_save_section_loop_selection_completed', function() {
		self.init_loop_selection_help();
	});
		
	self.save_wpa_loop_selection_options = function() {
		var dataholder = $( '.js-wpv-loop-selection-update' ),
		messages_container = dataholder.parents( '.js-wpv-update-action-wrap' ).find( '.js-wpv-message-container' ),
		section_container = $( '.js-wpv-settings-archive-loop' ),
		unsaved_message = dataholder.data('unsaved'),
		nonce = dataholder.data('nonce'),
		spinnerContainer;
		section_container
			.addClass( 'wpv-setting-replacing' )
			.find( '.wpv-spinner.ajax-loader' )
				.remove();
		messages_container.find('.toolset-alert-error').remove();
		spinnerContainer = $('<div class="wpv-spinner ajax-loader">').insertBefore( dataholder ).show();
		var data = {
			action:		'wpv_update_loop_selection',
			id:			self.view_id,
			form:		$('.js-loop-selection-form').serialize(),
			wpnonce:	nonce
		};
		$('.js-loop-selection-form input').prop( 'disabled', true );
		$.ajax({
			type:		"POST",
			dataType:	"json",
			url:		ajaxurl,
			data:		data,
			success:	function( response ) {
				if ( response.success ) {
					$( '.js-loop-selection-form' ).html( response.data.updated_archive_loops );
					$( document ).trigger( 'js_event_wpv_save_section_loop_selection_completed' );
				} else {
					Toolset.hooks.doAction( 'wpv-action-wpv-edit-screen-manage-ajax-fail', { data: response.data, container: messages_container} );
				}
			},
			error:		function (ajaxContext) {
				messages_container
					.wpvToolsetMessage({
						text:unsaved_message,
						type:'error',
						inline:true,
						stay:true
					});
			},
			complete:	function() {
				spinnerContainer.remove();
				section_container.removeClass( 'wpv-setting-replacing' );
				$('.js-loop-selection-form input').prop( 'disabled', false );
			}
		});
	};
	
	self.loop_selection_debounce_update = _.debounce( self.save_wpa_loop_selection_options, 1000 );
		
	$( document ).on( 'change', '.js-loop-selection-form input', function() {
		self.loop_selection_debounce_update();
	});
	
	$( document ).on( 'click', '.js-wpv-apply-post-types-to-archive-loop-dialog', function( e ) {
		e.preventDefault();
		var thiz = $( this );
		
		self.apply_post_types_to_loop_data = {
			type:			thiz.data( 'type' ),
			name:			thiz.data( 'name' ),
			'default_pt':	thiz.data( 'default' ),
			'selected_pt':	thiz.data( 'selected' )
		};
		
		self.post_types_for_archive_loops_dialog.dialog( "open" ).dialog({
			maxHeight:	self.calculate_dialog_maxHeight(),
			maxWidth:	self.calculate_dialog_maxWidth(),
			position:	{
				my:			"center top+50",
				at:			"center top",
				of:			window,
				collision:	"none"
			}
		});
		$( '.js-wpv-post-types-for-archive-loop' ).prop( 'checked', false );
		$( '.js-wpv-archive-loop-for-post-type-assignment' ).html( thiz.data( 'display' ) );
		$( '.js-wpv-apply-post-types-to-archive-loop' )
			.addClass( 'button-primary' )
			.removeClass( 'button-secondary' )
			.prop( 'disabled', false );
		_.each( thiz.data( 'selected' ), function( element, index, list ) {
			$( '.js-wpv-post-types-for-archive-loop-' + element ).prop( 'checked', true );
		});
	});
	
	self.restore_post_types_to_archive_loop = function() {
		$( '.js-wpv-post-types-for-archive-loop' ).prop( 'checked', false );
		_.each( self.apply_post_types_to_loop_data[ 'default_pt' ], function( element, index, list ) {
			$( '.js-wpv-post-types-for-archive-loop-' + element ).prop( 'checked', true );
		});
	}
	
	self.apply_post_types_to_archive_loop = function() {
		var post_types = $( '.js-wpv-post-types-for-archive-loop:checked' ).map( function() {
			return $( this ).val();
		}).get();
		if ( post_types.length == 0 ) {
			$( '.js-wpv-dialog-assign-post-type-to-archive-loop-dialog-content .js-wpv-message-container' ).wpvToolsetMessage({
				text:	"Select at least one post type",
				type:	'error',
				inline:	true,
				stay:	false
			});
		} else {
			var thiz = $( '.js-wpv-apply-post-types-to-archive-loop' ),
			spinnerContainer = $('<div class="wpv-spinner ajax-loader">').insertBefore( thiz ).show(),
			data = {
				action:		'wpv_update_post_types_for_archive_loop',
				id:			self.view_id,
				post_types:	post_types,
				type:		self.apply_post_types_to_loop_data.type,
				name:		self.apply_post_types_to_loop_data.name,
				wpnonce:	wpv_editor_strings.editor_nonce
			},
			data_for_events = {
				post_types:	post_types,
				type:		self.apply_post_types_to_loop_data.type,
				name:		self.apply_post_types_to_loop_data.name,
			};
			
			thiz
				.addClass( 'button-secondary' )
				.removeClass( 'button-primary' )
				.prop( 'disabled', true );
			
			$.ajax({
				type:		"POST",
				dataType:	"json",
				url:		ajaxurl,
				data:		data,
				success:	function( response ) {
					if ( response.success ) {
						$( '.js-loop-selection-form' ).html( response.data.updated_archive_loops );
						self.post_types_for_archive_loops_dialog.dialog( "close" );
						$( document ).trigger( 'js_event_wpv_post_types_for_archive_loop_updated', data_for_events );
					} else {
						$( '.js-wpv-dialog-assign-post-type-to-archive-loop-dialog-content .js-wpv-message-container' ).wpvToolsetMessage({
							text:	"Error",
							type:	'error',
							inline:	true,
							stay:	false
						});
					}
				},
				error:		function (ajaxContext) {
					$( '.js-wpv-dialog-assign-post-type-to-archive-loop-dialog-content .js-wpv-message-container' ).wpvToolsetMessage({
						text:	"Error",
						type:	'error',
						inline:	true,
						stay:	false
					});
				},
				complete:	function() {
					spinnerContainer.remove();
				}
			});
		}
	};
		
	// ---------------------------------
	// Sorting
	// ---------------------------------
	
	/**
	* save_view_sorting_options
	*
	* Save the sorting settings.
	*
	* @since 2.1
	*/
		
	self.save_view_sorting_options = function() {
		var dataholder = $( '.js-wpv-ordering-update' ),
		messages_container = dataholder.parents( '.js-wpv-update-action-wrap' ).find( '.js-wpv-message-container' ),
		section_container = $( '.js-wpv-settings-ordering' ),
		unsaved_message = dataholder.data( 'unsaved' ),
		nonce = dataholder.data( 'nonce' ),
		spinnerContainer,
		view_id = self.view_id;
		section_container.find( '.wpv-spinner.ajax-loader' ).remove();
		messages_container.find('.toolset-alert-error').remove();
		spinnerContainer = $('<div class="wpv-spinner ajax-loader">').insertBefore( dataholder ).show();
		var data = {
			action:			'wpv_update_sorting',
			id:				view_id,
			orderby:		$( 'select.js-wpv-posts-orderby' ).val(),
			order:			$( 'select.js-wpv-posts-order' ).val(),
			orderby_as:		$( 'select.js-wpv-posts-orderby-as' ).val(),
			orderby_second:	$( 'select.js-wpv-posts-orderby-second' ).val(),
			order_second:	$( 'select.js-wpv-posts-order-second' ).val(),
			wpnonce:		nonce
		};
		$.ajax({
			type: "POST",
			dataType: "json",
			url: ajaxurl,
			data: data,
			success: function( response ) {
				if ( response.success ) {
					$('.js-screen-options').find('.toolset-alert').remove();
					self.model.sorting = {
						posts:		{
							orderby:			data.orderby,
							orderby_as:			data.orderby_as,
							order:				data.order,
							orderby_secondary:	data.orderby_second,
							order_secondary:	data.order_second
						}
					};
					$( document ).trigger( 'js_event_wpv_save_section_sorting_completed' );
				} else {
					Toolset.hooks.doAction( 'wpv-action-wpv-edit-screen-manage-ajax-fail', { data: response.data, container: messages_container} );
				}
			},
			error: function (ajaxContext) {
				messages_container
					.wpvToolsetMessage({
						text:unsaved_message,
						type:'error',
						inline:true,
						stay:true
					});
			},
			complete: function() {
				spinnerContainer.remove();
			}
		});
	};
	
	self.sorting_debounce_update = _.debounce( self.save_view_sorting_options, 2000 );
	
	// Sorting - rand and pagination do not work well together
	self.sorting_random_and_pagination = function() {
		$('.js-wpv-settings-ordering .js-wpv-toolset-messages .toolset-alert, .js-wpv-settings-pagination .js-wpv-toolset-messages .toolset-alert').remove();
        if ( ( $( 'select.js-wpv-posts-orderby' ).val() == 'rand' || $( 'select.js-wpv-posts-orderby-second' ).val() == 'rand' )
			&& $( '.js-wpv-archive-pagination-type:checked' ).val() != 'disabled' ) {
			$('.js-wpv-settings-ordering .js-wpv-toolset-messages, .js-wpv-settings-pagination .js-wpv-toolset-messages' )
				.wpvToolsetMessage({
					text: $( 'select.js-wpv-posts-orderby' ).data( 'rand' ),
					stay: true,
					close: false,
					type: ''
				});
		}
        return self;
	};

    /**
	* Sorting - Control the availability of the "order" select box.
	*
	* Disable "order" select box if random order has been selected. Enable it otherwise.
	*
	* @since 2.1
	*/
	
    self.sorting_update_order_availability = function() {
        if ( $( 'select.js-wpv-posts-orderby' ).val() == 'rand' ) {
            $( 'select.js-wpv-posts-order' ).prop( 'disabled', true );
			$( '.js-wpv-settings-posts-order-secondary' ).hide();
        } else {
            $( 'select.js-wpv-posts-order' ).prop( 'disabled', false );
			$( '.js-wpv-settings-posts-order-secondary' ).fadeIn( 'fast' );
        }
		if ( 
			$( 'select.js-wpv-posts-orderby-second' ).val() == 'rand' 
			|| $( 'select.js-wpv-posts-orderby-second' ).val() == ''
		) {
            $( 'select.js-wpv-posts-order-second' ).prop( 'disabled', true );
        } else {
            $( 'select.js-wpv-posts-order-second' ).prop( 'disabled', false );
        }
		return self;
    };
	
	/**
	* sorting_manage_orderby_as - Control the visibility of orderby_as, based on selected field.
	*
	* Hides the orderby_as selection, if it's not ordering by a field.
	* Shows the orderby_as selection, if it's ordering by a field:
	* 	Sets the orderby_as to 'NUMERIC' if the field is a Types numeric or a date field.
	* 	Sets the orderby_as to 'STRING' if the field is another Types field type.
	* 	Sets the orderby_as to '' if the field is not a Types one.
	*
	* @todo AVoid depending on a shared and duplicated (!) ID attribute
	*
	* @since 2.1
	*/
	
	self.sorting_manage_orderby_as = function() {
		var selected = $( 'select.js-wpv-posts-orderby' ).val();
		if ( 
			( 
				'' !== selected 
				|| typeof selected !== undefined 
			) && 'field-' == selected.substr( 0, 6 ) 
		) {
			var field_type = $( 'select.js-wpv-posts-orderby' ).find( ":selected" ).data( "field-type" );
			if ( field_type !== undefined ) {
				switch ( field_type ) {
					case 'date':
					case 'numeric':
						$( 'select.js-wpv-posts-orderby-as' )
							.val( 'NUMERIC' )
							.prop( 'disabled', true );
						$( '.js-wpv-settings-posts-orderby-as' ).show();
						break;
					default:
						$( 'select.js-wpv-posts-orderby-as' )
							.val( 'STRING' )
							.prop( 'disabled', false );
						$( '.js-wpv-settings-posts-orderby-as' ).show();
						break;
				}
			} else {
				$( 'select.js-wpv-posts-orderby-as' )
					.val( '' )
					.prop( 'disabled', false );
				$( '.js-wpv-settings-posts-orderby-as' ).show();
			}
		} else {
			// @todo: reconsider this.
			// Reset to default before hiding.
			// So we don't need to keep track of the value when sending AJAX request.
			$( 'select.js-wpv-posts-orderby-as' )
				.val( '' )
				.prop( 'disabled', false );
			$( '.js-wpv-settings-posts-orderby-as' ).hide();
		}

		return self;
	}
	
	$( document ).on( 'click', '.js-wpv-settings-orderby-second-display', function( e ) {
		e.preventDefault();
		$( this )
			.find( 'i' )
				.toggleClass( 'fa-caret-down fa-caret-up' );
		$( '.js-wpv-settings-orderby-second-wrapper' ).fadeToggle( 'fast' );
	});
	
	self.adjust_sorting_section = function() {
        self
			.sorting_manage_orderby_as()
            .sorting_random_and_pagination()
			.sorting_update_order_availability();
	};
	
	$( document ).on( 'change', 'select.js-wpv-posts-orderby, select.js-wpv-posts-orderby-second', function() {
        self.adjust_sorting_section()
        self.sorting_debounce_update();
	});
	
	$( document ).on( 'change', 'select.js-wpv-posts-order, select.js-wpv-posts-orderby-as', function() {
		//self.sorting_random_and_pagination();
        self.sorting_debounce_update();
	});
	
	$( document ).on( 'change', 'select.js-wpv-posts-orderby-second, select.js-wpv-posts-order-second', function() {
		self
			.sorting_update_order_availability()
			.sorting_debounce_update();
	});
	
	// ---------------------------------
	// Sorting controls
	// ---------------------------------
	
	/**
	 * Cache sorting controls new row.
	 *
	 * @since 2.3.0
	 */
	self.sorting_orderby_options_row = {
		posts:		''
	};
	
	/**
	 * Flag to decide whether we need a new line when inserting sorting controls.
	 *
	 * @since 2.3.0
	 */
	self.sorting_insert_newline = false;
	
	/**
	 * Make the fronted sorting orderby options sortable.
	 *
	 * @since 2.3.0
	 */
	
	$( '.js-wpv-frontend-sorting-orderby-options-list tbody' ).sortable({
		handle: ".js-wpv-frontend-sorting-orderby-options-list-item-move",
		axis: 'y',
		containment: ".js-wpv-frontend-sorting-orderby-options-list tbody",
		items: "> tr",
		helper: function( e, ui ) {
			// Fix the collapse of the dragged row width
			// https://paulund.co.uk/fixed-width-sortable-tables
			ui.children().each( function() {
				$( this ).width( $( this ).width() );
			});
			return ui;
		},
		tolerance: "pointer",
		update: function( event, ui ) {
			self.update_sorting_controls_management();
		}
	});
	
	/**
	 * Restore the frontend sorting controls dialog to defaults on close.
	 *
	 * @since 2.3.0
	 */
	
	self.restore_sorting_dialog_options = function() {
		$( '#js-wpv-frontend-sorting-orderby-options-type, #js-wpv-frontend-sorting-order-options-type' ).val( 'select' ).trigger( 'change' );
		$( '#js-wpv-frontend-sorting-orderby-list-style, #js-wpv-frontend-sorting-order-list-style' ).val( 'default' ).trigger( 'change' );
		$( '.js-wpv-frontend-sorting-orderby-options-list-item-dropdown.js-wpv-toolset_selec2-inited' ).toolset_select2( 'destroy' );
		$( '.js-wpv-frontend-sorting-orderby-options-list tbody tr' ).remove();
		$( '#js-wpv-frontend-sorting-order-enable' ).prop( 'checked', false ).trigger( 'change' );
		$( '.js-wpv-frontend-sorting-order-options, .js-wpv-frontend-sorting-orderby-type-list-extra, .js-wpv-frontend-sorting-order-type-list-extra' ).hide();
		$( '.js-wpv-frontend-sorting-order-options-label-asc' ).val( wpv_editor_strings.dialog_sorting.labels.ascending );
		$( '.js-wpv-frontend-sorting-order-options-label-desc' ).val( wpv_editor_strings.dialog_sorting.labels.descending );
		$( '.js-wpv-frontend-sorting-orderby-options-enabled' ).hide();
	};
	
	/**
	 * Add a new frontend sorting oderby option.
	 *
	 * We add all the available values from the posts, taxonomy and users orderby native setting,
	 * stored on self.cache['sorting_options'],
	 * but we restict the valid options by meta fields, to avoid sorting by meta keys containing 
	 * commas, brackets or quotes (we only support alphanumeric, hypens and sashes) 
	 * becuse they are not easy to manage as URL parameters, and also 
	 * because it is difficult to define their optional label in the resulting shortcode.
	 *
	 * @note We cache each option per query type in self.sorting_orderby_options_row.
	 * @note We use the "dropdownParent" option for toolset_select2 since jQuery UI dialogs 
	 *     restrict focusable elements to the dialog structure itself.
	 * @note The data( 'toolset_select2' ) property of a toolset_Select2 object opens the door 
	 *     to some specificity per toolset_Select2 usage, including classnames and, therefore, styling.
	 *
	 * @since 2.3.0
	 */
	
	$( document ).on( 'click', '.js-wpv-frontend-sorting-orderby-options-add', function( e ) {
		e.preventDefault();
		self.add_sorting_dialog_orderby_option();
	});
	
	self.add_sorting_dialog_orderby_option = function() {		
		var current_query_type			= self.get_view_query_type(),
			orderby_control				= '',
			orderby_as_control			= '',
			orderby_label_control		= '',
			orderby_set_order_control	= '';
		
		if ( self.sorting_orderby_options_row[ current_query_type ] == '' ) {
			
			self.sorting_orderby_options_row[ current_query_type ] = wpv_editor_strings.dialog_sorting.option_row;
			
			self.sorting_orderby_options_row[ current_query_type ] = self.sorting_orderby_options_row[ current_query_type ]
				.replace( '%%orderby_sortable%%', '<i class="icon-move fa fa-arrows wpv-editable-list-item-move js-wpv-frontend-sorting-orderby-options-list-item-move"></i>' );
			self.sorting_orderby_options_row[ current_query_type ] = self.sorting_orderby_options_row[ current_query_type ]
				.replace( 
					'%%orderby_delete%%', 
					'<button class="button button-secondary button-small wpv-editable-list-item-delete js-wpv-frontend-sorting-orderby-options-list-item-delete"><i class="icon-remove fa fa-times"></i></button>' 
					+ '<button class="button buton-secondary button-smal wpv-editable-list-item-default-info js-wpv-frontend-sorting-orderby-options-list-item-default-info" style="display:none"><i class="fa fa-question-circle"></i></button>'
				);
			
			// Orderby select dropdown per query type
			orderby_control = '<select class="js-wpv-frontend-sorting-orderby-options-list-item-dropdown">';
			_.each( self.cache['sorting_options'][ current_query_type ], function( item, key, list ) {
				//item.value, = key item.title, item.type
				if ( /^[a-zA-Z0-9\-\_]+$/.test( item.value ) ) {
					orderby_control += '<option value="' + item.value + '" data-type="' + item.type + '">' + item.title + '</option>';
				}
				/*
				// In Views 2.3.0 we offered those excluded postmeta values, with a warning.
				// In views 2.3.1 we are removing them.
				// Leavind this as a trace to follow in case it is needed.
				// @until 2.5.0
				else if ( item.value.indexOf( '"' ) > -1 ) {
					orderby_control += '<option value="" data-type="excluded:quote">' + item.title + '</option>';
				} else if ( item.value.indexOf( "'" ) > -1 ) {
					orderby_control += '<option value="" data-type="excluded:squote">' + item.title + '</option>';
				} else if ( /\s/.test( item.value ) ) {
					orderby_control += '<option value="" data-type="excluded:space">' + item.title + '</option>';
				} else {
					orderby_control += '<option value="" data-type="excluded:format">' + item.title + '</option>';
				}
				*/
			});
			orderby_control += '</select>';
			
			// Orderby as select dropdown
			orderby_as_control += '<select class="js-wpv-frontend-sorting-orderby-options-list-item-as" style="display:none">';
			orderby_as_control += '<option value="">' + wpv_editor_strings.dialog_sorting.labels.sort_as_native + '</option>';
			orderby_as_control += '<option value="STRING">' + wpv_editor_strings.dialog_sorting.labels.sort_as_string + '</option>';
			orderby_as_control += '<option value="NUMERIC">' + wpv_editor_strings.dialog_sorting.labels.sort_as_number + '</option>';
			orderby_as_control += '</select>';
			
			// Orderby label input
			orderby_label_control += '<input type="text" class="js-wpv-frontend-sorting-orderby-options-list-item-label" value="" />';
			orderby_label_control += '<div class="js-wpv-frontend-sorting-orderby-options-list-item-label-direction" style="display:none;border-top: 1px solid #ccc; margin-top: 5px; padding: 3px 0;">';
			orderby_label_control += '<span style="display:block;">' + wpv_editor_strings.dialog_sorting.labels.sort_order + '</span>';
			orderby_label_control += '<label style="display:block"><em>Ascending:</em> <input type="text" class="js-wpv-frontend-sorting-orderby-options-list-item-label-asc" value="" /></label>';
			orderby_label_control += '<label style="display:block"><em>Descending:</em> <input type="text" class="js-wpv-frontend-sorting-orderby-options-list-item-label-desc" value="" /></label>';
			orderby_label_control += '</div>';
			
			// Orderby set order select dropdown
			orderby_set_order_control += '<select class="js-wpv-frontend-sorting-orderby-options-list-item-force-order">';
			orderby_set_order_control += '<option value="ASC">' + wpv_editor_strings.dialog_sorting.labels.direction_asc + '</option>';
			orderby_set_order_control += '<option value="DESC">' + wpv_editor_strings.dialog_sorting.labels.direction_desc + '</option>';
			orderby_set_order_control += '</select>';
			
			// Replace placeholders per query type
			self.sorting_orderby_options_row[ current_query_type ] = self.sorting_orderby_options_row[ current_query_type ]
				.replace( '%%orderby_options_select%%', orderby_control );
			self.sorting_orderby_options_row[ current_query_type ] = self.sorting_orderby_options_row[ current_query_type ]
				.replace( '%%orderby_as%%', orderby_as_control );
			self.sorting_orderby_options_row[ current_query_type ] = self.sorting_orderby_options_row[ current_query_type ]
				.replace( '%%orderby_label%%', orderby_label_control );
			self.sorting_orderby_options_row[ current_query_type ] = self.sorting_orderby_options_row[ current_query_type ]
				.replace( '%%orderby_set_order%%', orderby_set_order_control );
			
		}
		
		orderby_new_row = $( self.sorting_orderby_options_row[ current_query_type ] );
		
		if ( $( '#js-wpv-frontend-sorting-order-enable' ).prop( 'checked' ) ) {
			orderby_new_row
				.find( '.js-wpv-frontend-sorting-orderby-options-list-item-label-direction' )
					.show();
		}
		
		self.update_sorting_controls_row_labels( orderby_new_row );
		
		$( '.js-wpv-frontend-sorting-orderby-options-list tbody' ).append( orderby_new_row );
		
		var orderby_option_select = $( '.js-wpv-frontend-sorting-orderby-options-list tbody tr.js-wpv-frontend-sorting-orderby-options-list-item:last-child .js-wpv-frontend-sorting-orderby-options-list-item-dropdown' ),
			orderby_option_selected_value = orderby_option_select.val();
			
		if ( _.has( self.cache['sorting_options'][ current_query_type ], orderby_option_selected_value ) ) {
			$( '.js-wpv-frontend-sorting-orderby-options-list tbody tr.js-wpv-frontend-sorting-orderby-options-list-item:last-child .js-wpv-frontend-sorting-orderby-options-list-item-label' )
				.val( self.cache['sorting_options'][ current_query_type ][ orderby_option_selected_value ].title );
		}
		
		orderby_option_select
			.addClass( 'js-wpv-toolset_selec2-inited' )
			.toolset_select2(
				{ 
					width:				'resolve',
					dropdownAutoWidth:	true, 
					dropdownParent:		$( '#js-wpv-frontend-sorting-dialog' )
				}
			)
			.data( 'toolset_select2' )
				.$dropdown
					.addClass( 'toolset_select2-dropdown-in-dialog' );
		
		$( '.js-wpv-frontend-sorting-orderby-options-list tbody' ).sortable( 'refresh' );
		
		self
			.update_sorting_controls_management()
			.update_sorting_controls_visibility()
			.update_sorting_controls_preview();
		
		return self;
		
	};
	
	/**
	 * Remove a frontend sorting oderby option.
	 *
	 * @since 2.3.0
	 */
	
	$( document ).on( 'click', '.js-wpv-frontend-sorting-orderby-options-list-item-delete', function() {
		var delete_button = $( this ),
			delete_item = delete_button.closest( '.js-wpv-frontend-sorting-orderby-options-list-item' );
		
		delete_item.addClass( 'wpv-editable-list-item-deleted' );
		setTimeout( function () {
			delete_item.fadeOut( 'fast', function() {
				$( this ).remove();
				$( '.js-wpv-frontend-sorting-orderby-options-list tbody' ).sortable( 'refresh' );
				self
					.update_sorting_controls_management()
					.update_sorting_controls_visibility()
					.update_sorting_controls_preview();
			});
		}, 500 );
	});
	
	/**
	 * Display an informtional overlay when clicking the question icon on the first frontend sorting options row.
	 *
	 * @since 2.3.1
	 */
	
	$( document ).on( 'click', '.js-wpv-frontend-sorting-orderby-options-list-item-default-info', function() {
		var table_overlay = '<tr class="wpv-editable-list-item-default-info-overlay toolset-alert toolset-alert-info js-wpv-editable-list-item-default-info-overlay">';
		table_overlay += '<td colspan="5">';
		table_overlay += '<p>' + wpv_editor_strings.dialog_sorting.warnings.first_row + '</p>';
		table_overlay += '<span class="button button-primary button-small wpv-editable-list-item-default-info-close js-wpv-editable-list-item-default-info-close">';
		table_overlay += '<i class="icon-remove fa fa-times"></i>';
		table_overlay += '</span>';
		table_overlay += '</td>';
		table_overlay += '</tr>';
		$( '.js-wpv-frontend-sorting-orderby-options-list tbody' ).prepend( table_overlay );
	});
	
	/**
	 * Close the informtional overlay for the first frontend sorting options row.
	 *
	 * @since 2.3.1
	 */
	
	$( document ).on( 'click', '.js-wpv-editable-list-item-default-info-close', function() {
		$( '.wpv-editable-list-item-default-info-overlay' ).remove();
	});
	
	/**
	 * Map sorting values (and field types when sorting by meta values) to labels for ascending/descending directions.
	 *
	 * @since 2.3.1
	 */
	self.sorting_controls_row_labels_map = {
		// Field types
		'date': {
			'asc':	wpv_editor_strings.dialog_sorting.labels.asc_time,
			'desc':	wpv_editor_strings.dialog_sorting.labels.desc_time
		},
		'numeric': {
			'asc':	wpv_editor_strings.dialog_sorting.labels.ascending,
			'desc':	wpv_editor_strings.dialog_sorting.labels.descending
		},
		// Post fields
		'post_date': {
			'asc':	wpv_editor_strings.dialog_sorting.labels.asc_time,
			'desc':	wpv_editor_strings.dialog_sorting.labels.desc_time
		},
		'post_title': {
			'asc':	wpv_editor_strings.dialog_sorting.labels.asc_alphabet,
			'desc':	wpv_editor_strings.dialog_sorting.labels.desc_alphabet
		},
		'post_author': {
			'asc':	wpv_editor_strings.dialog_sorting.labels.asc_alphabet,
			'desc':	wpv_editor_strings.dialog_sorting.labels.desc_alphabet
		},
		'post_type': {
			'asc':	wpv_editor_strings.dialog_sorting.labels.asc_alphabet,
			'desc':	wpv_editor_strings.dialog_sorting.labels.desc_alphabet
		},
		'modified': {
			'asc':	wpv_editor_strings.dialog_sorting.labels.asc_time,
			'desc':	wpv_editor_strings.dialog_sorting.labels.desc_time
		},
		// Default
		'default': {
			'asc':	wpv_editor_strings.dialog_sorting.labels.ascending,
			'desc':	wpv_editor_strings.dialog_sorting.labels.descending
		}
	};
	
	/**
	 * Apply different sorting directions labels depending on the sorting option selected.
	 *
	 * @since 2.3.1
	 */
	self.update_sorting_controls_row_labels = function( item ) {
		var item_dropdown = item.find( '.js-wpv-frontend-sorting-orderby-options-list-item-dropdown' ),
			item_dropdown_selected = item_dropdown.find( ':selected' ),
			item_dropdown_selected_value = item_dropdown.val(),
			item_dropdown_selected_type = item_dropdown_selected.data( 'type' ),
			item_dropdown_selected_labels = {},
			current_query_type = self.get_view_query_type();
		
		// Remove orphan warning signs
		item
			.removeClass( 'wpv-editable-list-item-warning' )
			.find( '.toolset-alert' )
				.remove();
		
		// Return early if the selected field is excluded:
		if ( 
			item_dropdown_selected_value == '' 
			&& 'excluded:' == item_dropdown_selected_type.substr( 0, 9 )
		) {
			
			item
				.find( '.js-wpv-frontend-sorting-orderby-options-list-item-label' )
					.val( '' );
					
			var item_dropdown_selected_type_excluded_reason = item_dropdown_selected_type.substring( 9 );
			switch( item_dropdown_selected_type_excluded_reason ) {
				case 'quote':
				case 'squote':
				case 'space':
				case 'format':
				default:
					item
						.addClass( 'wpv-editable-list-item-warning' )
						.append( '<p class="toolset-alert toolset-alert-error">' + wpv_editor_strings.dialog_sorting.warnings.unsupported_field + '</p>' );
					break;
			}
			
			return;
			
		}
		
		// Fill the label input
		if ( _.has( self.cache['sorting_options'][ current_query_type ], item_dropdown_selected_value ) ) {
			item
				.find( '.js-wpv-frontend-sorting-orderby-options-list-item-label' )
					.val( self.cache['sorting_options'][ current_query_type ][ item_dropdown_selected_value ].title );
		}
		
		// Fill the directions label inputs
		// Fill the orderby_as selector
		if (
			'field-' == item_dropdown_selected_value.substr( 0, 6 ) 
			|| 'taxonomy-field-' == item_dropdown_selected_value.substr( 0, 15 ) 
			|| 'user-field-' == item_dropdown_selected_value.substr( 0, 11 ) 
		) {
			switch( item_dropdown_selected_type ) {
				case 'date':
					item.find( '.js-wpv-frontend-sorting-orderby-options-list-item-as' )
						.val( 'NUMERIC' )
						.prop( 'disabled', true )
						.show();
					break;
				case 'numeric':
					item.find( '.js-wpv-frontend-sorting-orderby-options-list-item-as' )
						.val( 'NUMERIC' )
						.prop( 'disabled', true )
						.show();
					break;
				case '':
					item.find( '.js-wpv-frontend-sorting-orderby-options-list-item-as' )
						.val( '' )
						.prop( 'disabled', false )
						.show();
					break;
				default:
					item.find( '.js-wpv-frontend-sorting-orderby-options-list-item-as' )
						.val( 'STRING' )
						.prop( 'disabled', false )
						.show();
					break;
			}
			item_dropdown_selected_labels = _.has( self.sorting_controls_row_labels_map, item_dropdown_selected_type ) ? self.sorting_controls_row_labels_map[ item_dropdown_selected_type ] : self.sorting_controls_row_labels_map[ 'default' ];
			item.find( '.js-wpv-frontend-sorting-orderby-options-list-item-label-asc' )
				.val( item_dropdown_selected_labels.asc );
			item.find( '.js-wpv-frontend-sorting-orderby-options-list-item-label-desc' )
				.val( item_dropdown_selected_labels.desc );
		} else {
			item.find( '.js-wpv-frontend-sorting-orderby-options-list-item-as' )
				.val( '' )
				.prop( 'disabled', false )
				.hide();
			item_dropdown_selected_labels = _.has( self.sorting_controls_row_labels_map, item_dropdown_selected_value ) ? self.sorting_controls_row_labels_map[ item_dropdown_selected_value ] : self.sorting_controls_row_labels_map[ 'default' ];
			item.find( '.js-wpv-frontend-sorting-orderby-options-list-item-label-asc' )
				.val( item_dropdown_selected_labels.asc );
			item.find( '.js-wpv-frontend-sorting-orderby-options-list-item-label-desc' )
				.val( item_dropdown_selected_labels.desc );
		}
		
		return self;
	};
	
	/**
	 * Manage changes in the frontend sorting orderby select dropdowns.
	 *
	 * When selecting a meta field not supported, a .toolset-alert message will be appended to the option row.
	 * Otherwise, we will update the option label and maybe offer the orderby_as option.
	 *
	 * @since 2.3.0
	 */
	
	$( document ).on( 'change', '.js-wpv-frontend-sorting-orderby-options-list-item-dropdown', function() {
		
		var item_dropdown = $( this ),
			item = item_dropdown.closest( '.js-wpv-frontend-sorting-orderby-options-list-item' );
		
		self.update_sorting_controls_row_labels( item )
			.update_sorting_controls_preview();// Mabe this one is not needed...
		
	});
	
	/**
	 * Enable the order settings in the frontend sorting controls dialog.
	 *
	 * @since 2.3.0
	 */
	
	$( document ).on( 'change', '#js-wpv-frontend-sorting-order-enable', function() {
		var sorting_order_enable = $( this );
		if ( sorting_order_enable.prop( 'checked' ) ) {
			$( '.js-wpv-frontend-sorting-order-options, .js-wpv-frontend-sorting-orderby-options-list-item-label-direction' ).fadeIn( 'fast' );
		} else {
			$( '.js-wpv-frontend-sorting-order-options, .js-wpv-frontend-sorting-orderby-options-list-item-label-direction' ).fadeOut( 'fast' );
		}
		
		self.update_sorting_controls_preview();
		
	});
	
	/**
	 * Track changes in the selectors to set frontend control types to update the previews accordingly.
	 *
	 * @since 2.3.0
	 */
	
	$( document ).on( 'change', '.js-wpv-frontend-sorting-orderby-options-type, .js-wpv-frontend-sorting-order-options-type', function() {
		self.update_sorting_controls_visibility();
		self.update_sorting_controls_preview();
	});
	
	/**
	 * Helper method to manage visibility of elements in the frontend sorting controls dialog.
	 *
	 * We will only display relevant options when there is at least one orderby option.
	 * Also, the list type style will only be visible when relevant.
	 * 
	 * @since 2.3.0
	 */
	
	self.update_sorting_controls_visibility = function() {
		var orderby_count = $( '.js-wpv-frontend-sorting-orderby-options-list tbody tr.js-wpv-frontend-sorting-orderby-options-list-item' ).length;
		if ( orderby_count > 0 ) {
			var orderby_type = $( '#js-wpv-frontend-sorting-orderby-options-type' ).val(),
				order_type = $( '#js-wpv-frontend-sorting-order-options-type' ).val();
			$( '.js-wpv-frontend-sorting-orderby-options-enabled' ).show();
			$( '.js-wpv-frontend-sorting-orderby-type-extra, .js-wpv-frontend-sorting-order-type-extra' ).hide();
			$( '.js-wpv-frontend-sorting-orderby-type-' + orderby_type + '-extra' ).show();
			$( '.js-wpv-frontend-sorting-order-type-' + order_type + '-extra' ).show();
		} else {
			$( '.js-wpv-frontend-sorting-orderby-options-enabled' ).hide();
		}
		return self;
	};
	
	/**
	 * Handle the clssname and visibility of delete/info buttons on frontend sorting controls rows.
	 *
	 * @since 2.3.1
	 */
	
	self.update_sorting_controls_management = function() {
		var orderby_options = $( '.js-wpv-frontend-sorting-orderby-options-list tbody tr.js-wpv-frontend-sorting-orderby-options-list-item' );
		if ( orderby_options.length > 0 ) {
			// Update handles for actions
			var orderby_first = orderby_options.first(),
				orderby_else = orderby_options.not( ':first' );
			orderby_first
				.find( '.js-wpv-frontend-sorting-orderby-options-list-item-delete' )
					.hide();
			orderby_first
				.find( '.js-wpv-frontend-sorting-orderby-options-list-item-default-info' )
					.show();
			orderby_else
				.find( '.js-wpv-frontend-sorting-orderby-options-list-item-delete' )
					.show();
			orderby_else
				.find( '.js-wpv-frontend-sorting-orderby-options-list-item-default-info' )
					.hide();
			// Update classname for default option
			orderby_options.removeClass( 'wpv-editable-list-item-default' );
			orderby_first.addClass( 'wpv-editable-list-item-default' );
		}
		return self;
	};
	
	/**
	 * Helper method to manage visibility of the preview in the frontend sorting controls dialog.
	 *
	 * We will only display an actual preview when there is at least one orderby option.
	 * 
	 * @since 2.3.0
	 */
	
	self.update_sorting_controls_preview = function() {
		
		var orderby_type = $( '#js-wpv-frontend-sorting-orderby-options-type' ).val(),
			orderby_count = $( '.js-wpv-frontend-sorting-orderby-options-list tbody tr.js-wpv-frontend-sorting-orderby-options-list-item' ).length,
			order_type = $( '#js-wpv-frontend-sorting-order-options-type' ).val(),
			order_enable = $( '#js-wpv-frontend-sorting-order-enable' ).prop( 'checked' );
		
		if ( orderby_count > 0 ) {
			$( '.js-wpv-frontend-sorting-preview-disabled' ).hide();
			$( '.js-wpv-frontend-sorting-preview-enabled' ).show();
			
			$( '.js-wpv-frontend-sorting-orderby-preview' )
				.addClass( 'disabled' )
				.hide();
			$( '.js-wpv-frontend-sorting-orderby-' + orderby_type + '-preview' )
				.removeClass( 'disabled' )
				.show();
			if ( order_enable ) {
				$( '.js-wpv-frontend-sorting-order-preview' )
					.addClass( 'disabled' )
					.hide();
				$( '.js-wpv-frontend-sorting-order-' + order_type + '-preview' )
					.removeClass( 'disabled' )
					.show();
			} else {
				$( '.js-wpv-frontend-sorting-order-preview' )
					.addClass( 'disabled' )
					.hide();
				$( '.js-wpv-frontend-sorting-order-' + order_type + '-preview' ).show();
			}
			
		} else {
			
			$( '.js-wpv-frontend-sorting-preview-disabled' ).show();
			$( '.js-wpv-frontend-sorting-preview-enabled' ).hide();
			
		}
		
	};
	
	/**
	 * Sorting controls list mode preview interaction: display on hover.
	 *
	 * @since 2.3.0
	 */
	
	$( document ).on( 'mouseenter', '.js-wpv-sort-list-dropdown', function() {
		var orderby_list = $( this );
		orderby_list
			.find( '.js-wpv-sort-list-item' )
				.css( {'display': 'block'} );
	});
	
	$( document ).on( 'mouseleave', '.js-wpv-sort-list-dropdown', function() {
		var orderby_list = $( this );
		orderby_list
			.find( '.js-wpv-sort-list-item:not(.wpv-sort-list-current)' )
				.css( {'display': 'none'} );
	});
	
	/**
	 * Helper method to update the preview style for frontend sorting controls as lists.
	 *
	 * @since 2.3.0
	 */
	 
	self.update_sorting_controls_preview_for_lists = function( current_control, current_style ) {
		$( '.js-wpv-sort-list-' + current_control + '-dropdown' )
			.removeClass( function( index, classes ) {
				return classes.split(/\s+/)
					.filter(
						function( el ) {
							return /^wpv-sort-list-dropdown-style-/.test( el );
						}
					)
					.join(' ');
			})
			.addClass( 'wpv-sort-list-dropdown-style-' + current_style );
	};
	
	$( document ).on( 'change', '#js-wpv-frontend-sorting-orderby-list-style', function() {
		var current_style = $( this ).val();
		self.update_sorting_controls_preview_for_lists( 'orderby', current_style );
	});
	
	$( document ).on( 'change', '#js-wpv-frontend-sorting-order-list-style', function() {
		var current_style = $( this ).val();
		self.update_sorting_controls_preview_for_lists( 'order', current_style );
	});
	
	/**
	 * Insert the sorting controls shortcodes into the relevant editor.
	 *
	 * @since 2.3.0
	 */
	
	self.insert_sorting_controls = function() {
		var shortcode = '',
			current_cursor,
			end_cursor,
			sorting_marker;
		
		if ( ! self.validate_sorting_controls() ) {
			$( '#js-wpv-frontend-sorting-dialog .wpv-shortcode-gui-content-wrapper' )
				.append( '<p class="toolset-alert toolset-alert-error js-wpv-frontend-sorting-orderby-options-list-empty">' + wpv_editor_strings.dialog_sorting.warnings.missing_options + '</p>' );
			setTimeout( function() {
				$( '.js-wpv-frontend-sorting-orderby-options-list-empty' )
					.fadeOut( 'fast', function() {
						$( this ).remove(); 
					});
			}, 2000 );
			return;
		}
		
		shortcode = self.get_sorting_shortcode();
		
		if ( self.sorting_insert_newline ) {
			shortcode += '\n';
			self.sorting_insert_newline = false;
		}
		
		if ( _.has( WPV_Toolset.CodeMirror_instance, window.wpcfActiveEditor ) ) {
			current_cursor = WPV_Toolset.CodeMirror_instance[ window.wpcfActiveEditor ].getCursor( true );
			WPV_Toolset.CodeMirror_instance[ window.wpcfActiveEditor ].replaceRange( shortcode, current_cursor, current_cursor );
			end_cursor = WPV_Toolset.CodeMirror_instance[ window.wpcfActiveEditor ].getCursor( true );
			sorting_marker = WPV_Toolset.CodeMirror_instance[ window.wpcfActiveEditor ].markText( current_cursor, end_cursor, self.codemirror_highlight_options );
			self.force_sorting_controls_to_settings();
			self.sorting_dialog.dialog( 'close' );
			WPV_Toolset.CodeMirror_instance[ window.wpcfActiveEditor ].focus();
			setTimeout( function() {
				sorting_marker.clear();
			}, 2000);
		}
		
	};
	
	/**
	 * Validate sorting controls against empty or non supported values, to block the shortcode generation.
	 *
	 * @since 2.3.1
	 */
	self.validate_sorting_controls = function() {
		var options_counter				= $( '.js-wpv-frontend-sorting-orderby-options-list tbody tr.js-wpv-frontend-sorting-orderby-options-list-item' ).length,
			rejected_options_counter	= 0,
			is_valid					= true;
		if ( options_counter == 0 ) {
			is_valid = false;
			return is_valid;
		} else {
			$.each( $( '.js-wpv-frontend-sorting-orderby-options-list .js-wpv-frontend-sorting-orderby-options-list-item-dropdown' ), function() {
				var orderby_item = $( this ),
					orderby_item_value = orderby_item.val(),
					orderby_item_type = orderby_item.find( ':selected' ).data( 'type' );
				if ( 
					orderby_item_value == '' 
					|| 'excluded:' == orderby_item_type.substr( 0, 9 )
				) {
					rejected_options_counter++;
				}
			});
			is_valid = ( options_counter > rejected_options_counter );
			return is_valid;
		}
		return is_valid;
	};
	
	/**
	 * Get the frontend sorting shortcodes given the dialog settings.
	 *
	 * @since 2.3.0
	 * @since 2.3.1 Add the ability to force a sorting direction to each sorting option.
	 */
	
	self.get_sorting_shortcode = function() {
		
		var output = '',
			orderby_item,
			orderby_item_option = '',
			orderby_item_label = '',
			orderby_options = [],
			orderby_options_labels = '',
			order_options_labels = '',
			orderby_as_numeric = [],
			orderby_force_direction_value = '',
			orderby_force_direction = {
				ASC: [],
				DESC: []
			};
		
		// Orderby shortcode
		
		output += '[wpv-sort-orderby';
		
		output += ' type="' + $( '#js-wpv-frontend-sorting-orderby-options-type' ).val() + '"';
		
		$.each( $( '.js-wpv-frontend-sorting-orderby-options-list tbody tr.js-wpv-frontend-sorting-orderby-options-list-item' ), function() {
			orderby_item = $( this );
			if ( orderby_item.find( '.js-wpv-frontend-sorting-orderby-options-list-item-dropdown' ).val() != '' ) {
				orderby_item_option = orderby_item.find( '.js-wpv-frontend-sorting-orderby-options-list-item-dropdown' ).val();
				if ( _.indexOf( orderby_options, orderby_item_option ) == -1 ) {
					orderby_item_label = self.sanitize_arbitrary_shortcode_value( orderby_item.find( '.js-wpv-frontend-sorting-orderby-options-list-item-label' ).val() );
					orderby_options.push( orderby_item_option );
					
					orderby_options_labels += ' label_for_' + orderby_item_option + '="' + orderby_item_label + '"';
					if ( orderby_item.find( '.js-wpv-frontend-sorting-orderby-options-list-item-label-asc' ).val() != '' ) {
						order_options_labels += ' label_asc_for_' + orderby_item_option + '="' + self.sanitize_arbitrary_shortcode_value( orderby_item.find( '.js-wpv-frontend-sorting-orderby-options-list-item-label-asc' ).val() ) + '"';
					}
					if ( orderby_item.find( '.js-wpv-frontend-sorting-orderby-options-list-item-label-desc' ).val() != '' ) {
						order_options_labels += ' label_desc_for_' + orderby_item_option + '="' + self.sanitize_arbitrary_shortcode_value( orderby_item.find( '.js-wpv-frontend-sorting-orderby-options-list-item-label-desc' ).val() ) + '"';
					}
					
					if ( orderby_item.find( '.js-wpv-frontend-sorting-orderby-options-list-item-as' ).val() == 'NUMERIC' ) {
						orderby_as_numeric.push( orderby_item_option );
					}
					orderby_force_direction_value = orderby_item.find( '.js-wpv-frontend-sorting-orderby-options-list-item-force-order' ).val();
					if ( '' != orderby_force_direction_value ) {
						orderby_force_direction[ orderby_force_direction_value ].push( orderby_item_option );
					}
				}
			}
		});
		if ( orderby_options.length > 0 ) {
			output += ' options="' + orderby_options.join( ',' ) + '"';
			output += orderby_options_labels;
			if ( orderby_as_numeric.length > 0 ) {
				output += ' orderby_as_numeric_for="' + orderby_as_numeric.join( ',' ) + '"';
			}
			if ( orderby_force_direction.ASC.length > 0 ) {
				output += ' orderby_ascending_for="' + orderby_force_direction.ASC.join( ',' ) + '"';
			}
			if ( orderby_force_direction.DESC.length > 0 ) {
				output += ' orderby_descending_for="' + orderby_force_direction.DESC.join( ',' ) + '"';
			}
		}
		if ( 'list' == $( '#js-wpv-frontend-sorting-orderby-options-type' ).val() ) {
			output += ' list_style="' + $( '#js-wpv-frontend-sorting-orderby-list-style' ).val() + '"';
		}
		
		output += ']';
		
		// Order shortcode, if needed
		
		if ( $( '#js-wpv-frontend-sorting-order-enable' ).prop( 'checked' ) ) {
			
			output += '[wpv-sort-order';
			
			output += ' type="' + $( '#js-wpv-frontend-sorting-order-options-type' ).val() + '"';
			
			output += ' options="' + $( '.js-wpv-frontend-sorting-order-options-order' ).val() + '"';
			
			if ( $( '.js-wpv-frontend-sorting-order-options-label-asc' ).val() != '' ) {
				output += ' label_for_asc="' + self.sanitize_arbitrary_shortcode_value( $( '.js-wpv-frontend-sorting-order-options-label-asc' ).val() ) + '"';
			}
			if ( $( '.js-wpv-frontend-sorting-order-options-label-desc' ).val() != '' ) {
				output += ' label_for_desc="' + self.sanitize_arbitrary_shortcode_value( $( '.js-wpv-frontend-sorting-order-options-label-desc' ).val() ) + '"';
			}
			
			output += order_options_labels;
			
			if ( 'list' == $( '#js-wpv-frontend-sorting-order-options-type' ).val() ) {
				output += ' list_style="' + $( '#js-wpv-frontend-sorting-order-list-style' ).val() + '"';
			}
			
			output+= ']';
			
		}
		
		return output;
	}
	
	/**
	 * Set the first frontend sorting controls row values from the View stored settings.
	 *
	 * @since 2.3.1
	 */
	
	self.force_sorting_controls_from_settings = function() {
		var orderby_options = $( '.js-wpv-frontend-sorting-orderby-options-list tbody tr.js-wpv-frontend-sorting-orderby-options-list-item' );
		if ( orderby_options.length > 0 ) {
			// Update handles for actions
			var orderby_first = orderby_options.first();
			orderby_first
				.find( '.js-wpv-frontend-sorting-orderby-options-list-item-dropdown' )
					.val( self.model.sorting.posts.orderby )
					.trigger( 'change' );
			orderby_first
				.find( '.js-wpv-frontend-sorting-orderby-options-list-item-as' )
					.val( self.model.sorting.posts.orderby_as )
					.trigger( 'change' );
			orderby_first
				.find( '.js-wpv-frontend-sorting-orderby-options-list-item-force-order' )
					.val( self.model.sorting.posts.order )
					.trigger( 'change' );
		}
		// Set the order control order based on the settings value
		switch ( self.model.sorting.posts.order ) {
			case 'ASC':
				$( '.js-wpv-frontend-sorting-order-options-order' ).val( 'asc,desc' );
				break;
			case 'DESC':
				$( '.js-wpv-frontend-sorting-order-options-order' ).val( 'desc,asc' );
				break;
		}
		return self;
	};
	
	/**
	 * Populate a first frontend sorting controls row with the View stored settings.
	 *
	 * @since 2.3.1
	 */
	
	self.populate_sorting_dialog_options = function() {
		self
			// Add a first sorting control
			.add_sorting_dialog_orderby_option()
			// Set the settings stored in the "Ordering" section
			.force_sorting_controls_from_settings();
			
	};
	
	/**
	 * Force the settings form the first row of the frontend sorting controls to the stored View settings.
	 *
	 * @since 2.3.1
	 */
	
	self.force_sorting_controls_to_settings = function() {
		var orderby_options = $( '.js-wpv-frontend-sorting-orderby-options-list tbody tr.js-wpv-frontend-sorting-orderby-options-list-item' );
		if ( orderby_options.length > 0 ) {
			// Update handles for actions
			var orderby_first = orderby_options.first(),
				orderby_to_force = orderby_first
					.find( '.js-wpv-frontend-sorting-orderby-options-list-item-dropdown' )
						.val(),
				orderby_as_to_force = orderby_first
					.find( '.js-wpv-frontend-sorting-orderby-options-list-item-as' )
						.val(),
				order_to_force = orderby_first
					.find( '.js-wpv-frontend-sorting-orderby-options-list-item-force-order' )
						.val();
				if ( orderby_to_force != self.model.sorting.posts.orderby ) {
					$( 'select.js-wpv-posts-orderby' )
						.val( orderby_to_force )
						.trigger( 'change' );
				}
				if ( order_to_force != self.model.sorting.posts.order ) {
					$( 'select.js-wpv-posts-order' )
						.val( order_to_force )
						.trigger( 'change' );
				}
				// Note that the orderby_as value alwas needs to be forced, 
				// since otherwise orderby Types fields would force their own values on the View settings.
				if (
					'field-' == orderby_to_force.substr( 0, 6 ) 
					|| 'taxonomy-field-' == orderby_to_force.substr( 0, 15 ) 
					|| 'user-field-' == orderby_to_force.substr( 0, 11 ) 
				) {
					$( 'select.js-wpv-posts-orderby-as' )
						.val( orderby_as_to_force )
						.trigger( 'change' );
				} else {
					$( 'select.js-wpv-posts-orderby-as' )
						.val( '' )
						.trigger( 'change' );
				}
		}
		return self;
	};
	
	/**
	 * Open the frontend sorting controlos dialog.
	 *
	 * @note Depending on the cursor position, we set the self.sorting_insert_newline flag.
	 *
	 * @since 2.3.0
	 */
	
	$( document ).on( 'click', '.js-wpv-sorting-dialog', function( e ) {
		e.preventDefault();
		
		var thiz = $( this ),
			active_textarea = thiz.data( 'content' ),
			current_cursor,
			text_before,
			text_after,
			insert_position;
			window.wpcfActiveEditor = active_textarea;
		if ( active_textarea == 'wpv_filter_meta_html_content' ) {
			current_cursor = WPV_Toolset.CodeMirror_instance['wpv_filter_meta_html_content'].getCursor( true );
			text_before = WPV_Toolset.CodeMirror_instance['wpv_filter_meta_html_content'].getRange({line:0,ch:0}, current_cursor);
			text_after = WPV_Toolset.CodeMirror_instance['wpv_filter_meta_html_content'].getRange(current_cursor, {line:WPV_Toolset.CodeMirror_instance['wpv_filter_meta_html_content'].lastLine(),ch:null});
			if ( 
				text_before.search(/\[wpv-filter-start.*?\]/g) == -1 
				|| text_after.search(/\[wpv-filter-end.*?\]/g) == -1 
			) {
				// Set the cursor at the end and open popup
				insert_position = WPV_Toolset.CodeMirror_instance['wpv_filter_meta_html_content'].getSearchCursor( '[wpv-filter-end]', false );
				insert_position.findNext();
				WPV_Toolset.CodeMirror_instance['wpv_filter_meta_html_content'].setSelection( insert_position.from(), insert_position.from() );
				self.sorting_insert_newline = true;
			}
		}
		if ( active_textarea == 'wpv_layout_meta_html_content' ) {
			current_cursor = WPV_Toolset.CodeMirror_instance['wpv_layout_meta_html_content'].getCursor( true );
			text_before = WPV_Toolset.CodeMirror_instance['wpv_layout_meta_html_content'].getRange({line:0,ch:0}, current_cursor);
			text_after = WPV_Toolset.CodeMirror_instance['wpv_layout_meta_html_content'].getRange(current_cursor, {line:WPV_Toolset.CodeMirror_instance['wpv_layout_meta_html_content'].lastLine(),ch:null});
			if ( 
				text_before.search(/\[wpv-layout-start.*?\]/g) == -1 
				|| text_after.search(/\[wpv-layout-end.*?\]/g) == -1 
			) {
				// Set the cursor at the end and open popup
				insert_position = WPV_Toolset.CodeMirror_instance['wpv_layout_meta_html_content'].getSearchCursor( '[wpv-layout-end]', false );
				insert_position.findNext();
				WPV_Toolset.CodeMirror_instance['wpv_layout_meta_html_content'].setSelection( insert_position.from(), insert_position.from() );
				self.sorting_insert_newline = true;
			}
		}
		
		self.sorting_dialog.dialog( 'open' ).dialog({
			maxHeight:	self.calculate_dialog_maxHeight(),
			width:		self.calculate_dialog_maxWidth(),
			maxWidth:	self.calculate_dialog_maxWidth(),
			position:	{
				my:			"center top+50",
				at:			"center top",
				of:			window,
				collision:	"none"
			}
		});
		
	});
	
	// ---------------------------------
	// Pagination
	// ---------------------------------
	
	/**
	* save_view_pagination_options
	*
	* Save the pagination settings.
	*
	* @since 2.1
	*/
	
	self.save_view_pagination_options = function() {
		var dataholder		= $( '.js-wpv-pagination-update' ),
		section_container	= $( '.js-wpv-settings-pagination' ),
		messages_container	= section_container.find( '.js-wpv-message-container' ),
		unsaved_message		= dataholder.data( 'unsaved' ),
		nonce				= dataholder.data( 'nonce' ),
		spinnerContainer,
		settings			= {
			type:				$( '.js-wpv-archive-pagination-type:checked' ).val(),
			'posts_per_page':	$( '.js-wpv-archive-pagination-posts-per-page' ).val(),
			effect:				$( '.js-wpv-archive-ajax-pagination-effect' ).val(),
			duration:			$( '.js-wpv-archive-ajax-pagination-duration' ).val(),
			'manage_history':	( $( '.js-wpv-archive-ajax-pagination-manage-history' ).length > 0 ) ? $( '.js-wpv-archive-ajax-pagination-manage-history' ).prop( 'checked' ) : false,
			tolerance:			$( '.js-wpv-archive-ajax-pagination-tolerance' ).val(),
			'preload_images':	$( '.js-wpv-archive-ajax-pagination-preload-images' ).prop( 'checked' ),
			'cache_pages':		$( '.js-wpv-archive-ajax-pagination-cache-pages' ).prop( 'checked' ),
			'preload_pages':	$( '.js-wpv-archive-ajax-pagination-preload-pages' ).prop( 'checked' ),
			'pre_reach':		$( '.js-wpv-archive-ajax-pagination-preload-reach' ).val(),
			spinner:			$( '.js-wpv-archive-pagination-spinner:checked' ).val(),
			'spinner_image':	$( '.js-wpv-archive-pagination-builtin-spinner-image:checked' ).val(),
			'spinner_image_uploaded':	$( '.js-wpv-archive-pagination-uploaded-spinner-image' ).val(),
		};
		
		section_container.find( '.wpv-spinner.ajax-loader' ).remove();
		messages_container.find('.toolset-alert-error').remove();
		spinnerContainer = $('<div class="wpv-spinner ajax-loader">').insertBefore( dataholder ).show();
		
		var data = {
			action:		'wpv_update_archive_pagination',
			id:			self.view_id,
			settings:	settings,
			wpnonce:	nonce
		};
		$.ajax({
			type: "POST",
			dataType: "json",
			url: ajaxurl,
			data: data,
			success: function( response ) {
				if ( response.success ) {
					$('.js-screen-options').find('.toolset-alert').remove();
				} else {
					Toolset.hooks.doAction( 'wpv-action-wpv-edit-screen-manage-ajax-fail', { data: response.data, container: messages_container} );
				}
			},
			error: function (ajaxContext) {
				messages_container
					.wpvToolsetMessage({
						text:unsaved_message,
						type:'error',
						inline:true,
						stay:true
					});
			},
			complete: function() {
				spinnerContainer.remove();
			}
		});
	};
	
	self.pagination_debounce_update = _.debounce( self.save_view_pagination_options, 1000 );
	
	self.manage_editor_pagination_controls_button = function() {
		var type	= $( '.js-wpv-archive-pagination-type:checked' ).val(),
		effect		= $( '.js-wpv-archive-ajax-pagination-effect' ).val(),
		button		= $( '.js-wpv-archive-editor-pagination-button-wrapper' );
		switch ( type ) {
			case 'disabled':
				button.hide();
				break;
			case 'paged':
				button.fadeIn( 'fast' );
				break;
			case 'ajaxed':
				if ( effect == 'infinite' ) {
					button.hide();
				} else {
					button.fadeIn( 'fast' );
				}
				break;
		}
		return self;
	};
	
	$( document ).on( 'change', '.js-wpv-archive-pagination-type', function() {
		var type = $( '.js-wpv-archive-pagination-type:checked' ).val();
		switch ( type ) {
			case 'disabled':
				$( '.js-wpv-archive-pagination-advanced-settings' ).hide();
                $( '.js-wpv-archive-pagination-advanced-container' ).hide();
                $( '.js-wpv-archive-pagination-advanced' ).find( 'i' ).toggleClass( 'fa-caret-down fa-caret-up' );
				break;
			case 'paged':
				$( '.js-wpv-archive-ajax-pagination-settings-extra' ).hide();
				$( '.js-wpv-archive-pagination-advanced-settings' ).fadeIn( 'fast' );
                $( '.js-wpv-archive-pagination-advanced-container' ).hide();
                $( '.js-wpv-archive-pagination-advanced' ).find( 'i' ).toggleClass( 'fa-caret-down fa-caret-up' );
				break;
			case 'ajaxed':
				$( '.js-wpv-archive-ajax-pagination-settings-extra' ).fadeIn( 'fast' );
				$( '.js-wpv-archive-pagination-advanced-settings' ).fadeIn( 'fast' );
				break;
		}
		self
			.manage_editor_pagination_controls_button()
            .sorting_random_and_pagination()
			.pagination_debounce_update();
	});
	
	$( document ).on( 'change', '.js-wpv-archive-pagination-posts-per-page', function() {
		if ( $( this ).val() == 'default' ) {
			$( '.js-wpv-archive-pagination-posts-per-page-default' ).fadeIn( 'fast' );
		} else {
			$( '.js-wpv-archive-pagination-posts-per-page-default' ).hide();
		}
	});
	
	$( document ).on( 'change', '.js-wpv-archive-ajax-pagination-effect', function() {
		if ( $( this ).val() == 'infinite' ) {
			$( '.js-wpv-archive-pagination-advanced-infinite-tolerance' ).fadeIn( 'fast' );
			$( '.js-wpv-archive-pagination-advanced-history-management' ).hide();
		} else {
			$( '.js-wpv-archive-pagination-advanced-infinite-tolerance' ).hide();
			$( '.js-wpv-archive-pagination-advanced-history-management' ).fadeIn( 'fast' );
		}
		self.manage_editor_pagination_controls_button();
	});
	
	$( document ).on( 'click', '.js-wpv-archive-pagination-advanced', function( e ) {
		e.preventDefault();
		$( this )
			.find( 'i' )
				.toggleClass( 'fa-caret-down fa-caret-up' );
		$( '.js-wpv-archive-pagination-advanced-container' ).fadeToggle( 'fast' );
	});
	
	$( document ).on( 'change', '.js-wpv-archive-pagination-spinner', function() {
		var thiz_value = $( '.js-wpv-archive-pagination-spinner:checked' ).val();
		switch ( thiz_value ) {
			case 'builtin':
				$( '.js-wpv-archive-pagination-spinner-builtin' ).fadeIn( 'fast' );
				$( '.js-wpv-archive-pagination-spinner-uploaded' ).hide();
				break;
			case 'uploaded':
				$( '.js-wpv-archive-pagination-spinner-builtin' ).hide();
				$( '.js-wpv-archive-pagination-spinner-uploaded' ).fadeIn( 'fast' );
				break;
			default:
				$( '.js-wpv-archive-pagination-spinner-builtin, .js-wpv-archive-pagination-spinner-uploaded' ).hide();
				break;
		}
	});
	
	$( document ).on( 'change', '.js-wpv-archive-pagination-advanced-settings input, .js-wpv-archive-pagination-advanced-settings select', function() {
		self.pagination_debounce_update();
	});
	
	// ---------------------------------
	// Pagination controls
	// ---------------------------------
	
	self.pagination_insert_newline = false;
	
	/**
	* This happens when user clicks on the "Pagination controls" button in the Layout HTML/CSS/JS section.
	*
	* A dialog for selecting controls to insert ("js-wpv-archive-pagination-dialog") is displayed. The process then
	* continues with clicking on a button with class "js-wpv-insert-archive-pagination".
	*
	* @since 1.7
	*/
	
	$( document ).on( 'click', '.js-wpv-archive-pagination-popup', function( e ) {
		e.preventDefault();
		self.archive_pagination_dialog.dialog( 'open' ).dialog({
			maxHeight:	self.calculate_dialog_maxHeight(),
			maxWidth:	self.calculate_dialog_maxWidth(),
			position:	{
				my:			"center top+50",
				at:			"center top",
				of:			window,
				collision:	"none"
			}
		});
	});
	
	self.init_pagination_dialog_options = function() {
		$( '.js-wpv-archive-pagination-control, .js-wpv-archive-pagination-shortcode-attribute:checkbox' ).prop( 'checked', false );
		$( '.js-wpv-archive-pagination-shortcode-attribute:text' ).val( '' );
		$( '.js-wpv-dialog-pagination-wizard-item-extra' ).hide();
		$( '.js-wpv-dialog-pagination-wizard-preview' ).addClass( 'disabled' );
		$( '.js-wpv-insert-archive-pagination' )
			.prop( 'disabled', true )
			.removeClass( 'button-primary' )
			.addClass( 'button-secondary' );
	};
	
	self.get_pagination_shortcode = function() {
		var output = '';
		$.each( $( 'input.js-wpv-archive-pagination-control:checked' ), function() {
			var thiz = $( this ),
			value = thiz.val(),
			container = thiz.closest( '.js-wpv-archive-pagination-shortcode' );
			switch ( value ) {
				case 'wpv-pager-archive-prev-page':
					output += '[' + value;
					container
						.find( '.js-wpv-archive-pagination-shortcode-attribute' )
							.each( function() {
								var thiz_attr = $( this );
								switch ( thiz_attr.attr( 'type' ) ) {
									case 'checkbox':
										if ( thiz_attr.prop( 'checked' ) ) {
											output += ' ' + thiz_attr.data( 'attribute' ) + '="' + thiz_attr.val() + '"';
										}
										break;
									case 'text':
										if ( thiz_attr.val() != '' ) {
											output += ' ' + thiz_attr.data( 'attribute' ) + '="' + thiz_attr.val() + '"';
										}
										break;
								}
							});
					output += '][wpml-string context="wpv-views"]Previous[/wpml-string][/wpv-pager-archive-prev-page]';
					break;
				case 'wpv-pager-archive-next-page':
					output += '[' + value;
					container
						.find( '.js-wpv-archive-pagination-shortcode-attribute' )
							.each( function() {
								var thiz_attr = $( this );
								switch ( thiz_attr.attr( 'type' ) ) {
									case 'checkbox':
										if ( thiz_attr.prop( 'checked' ) ) {
											output += ' ' + thiz_attr.data( 'attribute' ) + '="' + thiz_attr.val() + '"';
										}
										break;
									case 'text':
										if ( thiz_attr.val() != '' ) {
											output += ' ' + thiz_attr.data( 'attribute' ) + '="' + thiz_attr.val() + '"';
										}
										break;
								}
							});
					output += '][wpml-string context="wpv-views"]Next[/wpml-string][/wpv-pager-archive-next-page]';
					break;
				case 'wpv-pager-archive-nav-links':
					output += '[' + value;
					container
						.find( '.js-wpv-archive-pagination-shortcode-attribute' )
							.each( function() {
								var thiz_attr = $( this );
								switch ( thiz_attr.attr( 'type' ) ) {
									case 'checkbox':
										if ( thiz_attr.prop( 'checked' ) ) {
											output += ' ' + thiz_attr.data( 'attribute' ) + '="' + thiz_attr.val() + '"';
										}
										break;
									case 'text':
										if ( thiz_attr.val() != '' ) {
											output += ' ' + thiz_attr.data( 'attribute' ) + '="' + thiz_attr.val() + '"';
										}
										break;
								}
							});
					output += ']';
					break;
				case 'wpv-pager-archive-current-page':
				case 'wpv-pager-archive-total-pages':
					output += '[' + value + ']';
					break;
			}
		});
		return output;
	};


	/**
	* Insert archive pagination controls on cursor position into layout editor.
	*
	* This happens when user clicks on the submit button in "js-wpv-archive-pagination-dialog" dialog.
	*
	* @since 1.7
	*/
	
	$( document ).on( 'click', '.js-wpv-insert-archive-pagination', function( e ) {
		
		var pagination_shortcodes = self.get_pagination_shortcode();
		
		// Insert pagination shortcodes at cursor position in the Layout editor
		var current_cursor = WPV_Toolset.CodeMirror_instance['wpv_layout_meta_html_content'].getCursor( true );
		
		WPV_Toolset.CodeMirror_instance['wpv_layout_meta_html_content'].replaceRange( pagination_shortcodes, current_cursor, current_cursor );
		
		var end_cursor = WPV_Toolset.CodeMirror_instance['wpv_layout_meta_html_content'].getCursor( true ),
		pagination_marker = WPV_Toolset.CodeMirror_instance['wpv_layout_meta_html_content'].markText( current_cursor, end_cursor, self.codemirror_highlight_options );
		
		self.archive_pagination_dialog.dialog( 'close' );
		WPV_Toolset.CodeMirror_instance['wpv_layout_meta_html_content'].refresh();
		WPV_Toolset.CodeMirror_instance['wpv_layout_meta_html_content'].focus();
		
		setTimeout( function() {
			pagination_marker.clear();
		}, 2000);
		
	});


	/**
	* Enable or disable the submit button in "js-wpv-archive-pagination-dialog" dialog depending on the input validity.
	* Manage extra attributes for a given shortcode.
	*
	* @since 1.7
	*/
	
	$( document ).on( 'change', '.js-wpv-archive-pagination-control', function( e ) {
		var thiz = $( this ),
		thiz_container = thiz.closest( '.js-wpv-archive-pagination-shortcode' ),
		selected_options = $( '.js-wpv-archive-pagination-control:checked' ),
		submit_button = $('.js-wpv-insert-archive-pagination');
		
		if ( thiz.prop( 'checked' ) ) {
			thiz_container
				.find( '.js-wpv-archive-pagination-shortcode-attribute-container' )
					.fadeIn( 'fast' );
			thiz_container
				.find( '.js-wpv-dialog-pagination-wizard-preview' )
					.removeClass( 'disabled' );
		} else {
			thiz_container
				.find( '.js-wpv-archive-pagination-shortcode-attribute-container' )
					.fadeOut( 'fast' );
			thiz_container
				.find( '.js-wpv-dialog-pagination-wizard-preview' )
					.addClass( 'disabled' );
		}
		
		if ( selected_options.length > 0 ) {
			submit_button
				.prop( 'disabled', false )
				.addClass( 'button-primary' )
				.removeClass( 'button-secondary' );
		} else {
			submit_button
				.prop( 'disabled', true )
				.removeClass( 'button-primary' )
				.addClass( 'button-secondary' );
		}
		
		if ( selected_options.length > 0 ) {
			submit_button
				.prop( 'disabled', false )
				.addClass( 'button-primary' )
				.removeClass( 'button-secondary' );
		} else {
			submit_button
				.prop( 'disabled', true )
				.removeClass( 'button-primary' )
				.addClass( 'button-secondary' );
		}
		
	});
	
	// ---------------------------------
	// Parametric search
	// ---------------------------------
	
	// Parametric search - update automatically
	
	self.save_view_parametric_search_options = function() {
		var dataholder = $( '.js-wpv-filter-dps-update' ),
		messages_container = dataholder.parents( '.js-wpv-update-action-wrap' ).find( '.js-wpv-message-container' ),
		section_container = $( '.js-wpv-settings-filter-extra-parametric' ),
		nonce = dataholder.data('nonce'),
		spinnerContainer,
		unsaved_message = dataholder.data('unsaved'),
		dps_data = $('.js-wpv-dps-settings input, .js-wpv-dps-settings select').serialize();
		section_container.find( '.wpv-spinner.ajax-loader' ).remove();
		messages_container.find('.toolset-alert-error').remove();
		spinnerContainer = $('<div class="wpv-spinner ajax-loader">').insertBefore( dataholder ).show();
		var params = {
			action: 'wpv_filter_update_dps_settings',
			id: self.view_id,
			dpsdata: dps_data,
			wpnonce: nonce
		}
		$.ajax({
			type: "POST",
			dataType: "json",
			url: ajaxurl,
			data: params,
			success: function( response ) {
				if ( response.success ) {
					
				} else {
					Toolset.hooks.doAction( 'wpv-action-wpv-edit-screen-manage-ajax-fail', { data: response.data, container: messages_container} );
				}
			},
			error:function(ajaxContext){
				messages_container
					.wpvToolsetMessage({
						 text:unsaved_message,
						 type:'error',
						 inline:true,
						 stay:true
					});
				console.log( "Error: ", ajaxContext.responseText );
			},
			complete:function(){
				spinnerContainer.remove();
			}
		});
	};
	
	self.parametric_search_debounce_update = _.debounce( self.save_view_parametric_search_options, 1000 );
	
	// Parametric search - events
	
	$( document ).on( 'change keypress keyup input cut paste', '.js-wpv-dps-settings input', function() {
		self.parametric_search_debounce_update();
	});
	
	// ---------------------------------
	// Filter editor
	// ---------------------------------
	
	self.codemirror_filter_editors_track = function() {
		$( '.js-wpv-filter-extra-update' ).parent().find( '.toolset-alert-error' ).remove();
		if (
			WPV_Toolset.CodeMirror_instance_value['wpv_filter_meta_html_content'] != WPV_Toolset.CodeMirror_instance['wpv_filter_meta_html_content'].getValue()
			|| WPV_Toolset.CodeMirror_instance_value['wpv_filter_meta_html_css'] != WPV_Toolset.CodeMirror_instance['wpv_filter_meta_html_css']	.getValue()
			|| WPV_Toolset.CodeMirror_instance_value['wpv_filter_meta_html_js'] != WPV_Toolset.CodeMirror_instance['wpv_filter_meta_html_js'].getValue()
		) {
			self.manage_save_queue( 'save_section_filter', 'add' );
			$( '.js-wpv-filter-extra-update' )
				.prop('disabled', false)
				.removeClass('button-secondary')
				.addClass('button-primary js-wpv-section-unsaved');
			Toolset.hooks.doAction( 'wpv-action-wpv-edit-screen-set-confirm-unload', true );
		} else {
			self.manage_save_queue( 'save_section_filter', 'remove' );
			$( '.js-wpv-filter-extra-update' )
				.prop('disabled', true)
				.removeClass('button-primary js-wpv-section-unsaved')
				.addClass('button-secondary');
			$( document ).trigger( 'js_event_wpv_set_confirmation_unload_check' );
		}
	};
	
	self.save_section_filter = function( event, propagate ) {
		var thiz		= $( '.js-wpv-filter-extra-update' ),
		query_val		= WPV_Toolset.CodeMirror_instance['wpv_filter_meta_html_content'].getValue(),
		query_css_val	= WPV_Toolset.CodeMirror_instance['wpv_filter_meta_html_css'].getValue(),
		query_js_val	= WPV_Toolset.CodeMirror_instance['wpv_filter_meta_html_js'].getValue(),
		
		thiz_container = thiz.parents( '.js-wpv-settings-filter-extra' ),
		thiz_message_container = thiz_container.find( '.js-wpv-message-container' ),
		//update_message = thiz.data('success'),
		unsaved_message = thiz.data('unsaved'),
		nonce = thiz.data('nonce'),
		spinnerContainer = $('<div class="wpv-spinner ajax-loader">').insertBefore( thiz ).show();
		
		self.manage_save_queue( 'save_section_filter', 'remove' );
		
		thiz_container.find('.toolset-alert-error').remove();
		
		thiz
			.prop( 'disabled', true )
			.removeClass( 'button-primary' )
			.addClass( 'button-secondary' );
			
		var data = {
			action:			'wpv_update_filter_extra',
			id:				self.view_id,
			query_val:		query_val,
			query_css_val:	query_css_val,
			query_js_val:	query_js_val,
			wpnonce:		nonce
		};
		
		$.ajax({
			type:		"POST",
			dataType:	"json",
			url:		ajaxurl,
			data:		data,
			success:	function( response ) {
				if ( response.success ) {
					thiz.removeClass('js-wpv-section-unsaved');
					WPV_Toolset.CodeMirror_instance_value['wpv_filter_meta_html_content']	= query_val;
					WPV_Toolset.CodeMirror_instance_value['wpv_filter_meta_html_css']		= query_css_val;
					WPV_Toolset.CodeMirror_instance_value['wpv_filter_meta_html_js']		= query_js_val;
					
					Toolset.hooks.doAction( 'wpv-action-wpv-edit-screen-manage-parametric-search-hints', response.data.parametric );
					
					self.manage_ajax_success( response.data, thiz_message_container );
					$( document ).trigger( event );
					if ( propagate ) {
						$( document ).trigger( 'js_wpv_save_section_queue' );
					} else {
						$( document ).trigger( 'js_event_wpv_set_confirmation_unload_check' );
					}
				} else {
					Toolset.hooks.doAction( 'wpv-action-wpv-edit-screen-manage-ajax-fail', { data: response.data, container: thiz_message_container} );
					self.save_fail_queue.push( 'save_section_filter' );
					if ( propagate ) {
						$( document ).trigger( 'js_wpv_save_section_queue' );
					}
				}
			},
			error:		function (ajaxContext) {
				thiz_message_container
					.wpvToolsetMessage({
						text:unsaved_message,
						type:'error',
						inline:true,
						stay:true
					});
				self.save_fail_queue.push( 'save_section_filter' );
				if ( propagate ) {
					$( document ).trigger( 'js_wpv_save_section_queue' );
				}
			},
			complete:	function() {
				spinnerContainer.remove();
			}
		});
	};
	
	self.save_callbacks['save_section_filter'] = {
		callback:	self.save_section_filter,
		event:		'js_event_wpv_save_section_filter_completed'
	};

	$( '.js-wpv-filter-extra-update' ).on( 'click', function( e ) {
		e.preventDefault();
		self.save_section_filter( 'js_event_wpv_save_section_filter_completed', false );
	});
	
	// ---------------------------------
	// Frontend Events
	// ---------------------------------
	
	$( document ).on( 'change', '.js-wpv-frontend-event-gui', function() {
		self.manage_frontend_events_dialog_button();
	});
	
	self.manage_frontend_events_dialog_button = function() {
		if ( $( 'input.js-wpv-frontend-event-gui:checked', '#js-wpv-dialog-views-frontend-events' ).length > 0 ) {
			$( '.js-wpv-frontend-events-insert' )
				.addClass( 'button-primary' )
				.removeClass( 'button-secondary' )
				.prop( 'disabled', false );
		} else {
			$( '.js-wpv-frontend-events-insert' )
				.addClass( 'button-secondary' )
				.removeClass( 'button-primary' )
				.prop( 'disabled', true );
		}
	};
	
	self.insert_frontend_event_handler = function() {
		var thiz_insert_array = [],
		thiz_insert = '';;
		$( '#js-wpv-dialog-views-frontend-events .js-wpv-frontend-event-gui:checked' ).each( function() {
			var thiz_event = $( this ).data( 'event' );
			thiz_insert = "jQuery( document ).on( '" + thiz_event + "', function( event, data ) {";
			if ( thiz_event in self.frontend_events_comments ) {
				thiz_insert += self.frontend_events_comments[thiz_event];
			}
			thiz_insert += "\n\t\n";
			thiz_insert += "});";
			thiz_insert_array.push( thiz_insert );
			$( this ).prop( 'checked', false );
		});
		self.frontend_events_dialog.dialog( "close" );
		window.icl_editor.insert( thiz_insert_array.join( "\n") );
	};
	
	$( document ).on( 'click', '.js-wpv-views-frontend-events-popup', function() {
		window.wpcfActiveEditor = $( this ).data( 'content' );
		self.frontend_events_dialog.dialog('open').dialog({
            maxHeight:	self.calculate_dialog_maxHeight(),
			maxWidth:	self.calculate_dialog_maxWidth(),
			position:	{ 
				my:			"center top+50", 
				at:			"center top", 
				of:			window, 
				collision:	"none"
			}
        });
	});
	
	// ---------------------------------
	// Loop Output
	// ---------------------------------	
	
	self.codemirror_layout_editors_track = function() {
		$( '.js-wpv-layout-extra-update' ).parent().find( '.toolset-alert-error' ).remove();
		if (
			WPV_Toolset.CodeMirror_instance_value['wpv_layout_meta_html_content'] != WPV_Toolset.CodeMirror_instance['wpv_layout_meta_html_content'].getValue()
			|| WPV_Toolset.CodeMirror_instance_value['wpv_layout_meta_html_css'] != WPV_Toolset.CodeMirror_instance['wpv_layout_meta_html_css']	.getValue()
			|| WPV_Toolset.CodeMirror_instance_value['wpv_layout_meta_html_js'] != WPV_Toolset.CodeMirror_instance['wpv_layout_meta_html_js'].getValue()
		) {
			self.manage_save_queue( 'save_section_loop_output', 'add' );
			$( '.js-wpv-layout-extra-update' )
				.prop('disabled', false)
				.removeClass('button-secondary')
				.addClass('button-primary js-wpv-section-unsaved');
			Toolset.hooks.doAction( 'wpv-action-wpv-edit-screen-set-confirm-unload', true );
		} else {
			self.manage_save_queue( 'save_section_loop_output', 'remove' );
			$( '.js-wpv-layout-extra-update' )
				.prop('disabled', true)
				.removeClass('button-primary js-wpv-section-unsaved')
				.addClass('button-secondary');
			$( document ).trigger( 'js_event_wpv_set_confirmation_unload_check' );
		}
	};
	
	self.save_section_loop_output = function( event, propagate ) {
		var thiz		= $( '.js-wpv-layout-extra-update' ),
		layout_val		= WPV_Toolset.CodeMirror_instance['wpv_layout_meta_html_content'].getValue(),
		layout_css_val	= WPV_Toolset.CodeMirror_instance['wpv_layout_meta_html_css'].getValue(),
		layout_js_val	= WPV_Toolset.CodeMirror_instance['wpv_layout_meta_html_js'].getValue(),
		
		thiz_container = thiz.closest( '.js-wpv-settings-layout-extra' ),
		thiz_message_container = thiz_container.find( '.js-wpv-message-container' ),
		//update_message = thiz.data('success'),
		unsaved_message = thiz.data('unsaved'),
		nonce = thiz.data('nonce'),
		spinnerContainer = $('<div class="wpv-spinner ajax-loader">').insertBefore( thiz ).show();
		
		self.manage_save_queue( 'save_section_loop_output', 'remove' );
		
		thiz_container.find('.toolset-alert-error').remove();
		
		thiz
			.prop( 'disabled', true )
			.removeClass( 'button-primary' )
			.addClass( 'button-secondary' );
			
		var data = {
			action:			'wpv_update_layout_extra',
			id:				self.view_id,
			layout_val:		layout_val,
			layout_css_val:	layout_css_val,
			layout_js_val:	layout_js_val,
			wpnonce:		nonce
		};

		// Include the wizard settings
		if ( WPViews.layout_wizard.settings_from_wizard ) {
			data.include_wizard_data = 'true';
			for ( var attr_name in WPViews.layout_wizard.settings_from_wizard ) {
				data[ attr_name ] = WPViews.layout_wizard.settings_from_wizard[ attr_name ];
			}
			if ( ! WPViews.layout_wizard.use_loop_template ) {
				if ( WPViews.layout_wizard.use_loop_template_id != '' ) {
					data['delete_view_loop_template'] =  WPViews.layout_wizard.use_loop_template_id;
					WPViews.view_edit_screen_inline_content_templates.remove_inline_content_template( WPViews.layout_wizard.use_loop_template_id, $( '.js-wpv-ct-listing-' + WPViews.layout_wizard.use_loop_template_id ) );
				}
				WPViews.layout_wizard.use_loop_template_id = '';
				WPViews.layout_wizard.use_loop_template_title = '';
			}
		}
		
		$.ajax({
			type:		"POST",
			dataType:	"json",
			url:		ajaxurl,
			data:		data,
			success:	function( response ) {
				if ( response.success ) {
					thiz.removeClass('js-wpv-section-unsaved');
					WPV_Toolset.CodeMirror_instance_value['wpv_layout_meta_html_content']	= layout_val;
					WPV_Toolset.CodeMirror_instance_value['wpv_layout_meta_html_css']		= layout_css_val;
					WPV_Toolset.CodeMirror_instance_value['wpv_layout_meta_html_js']		= layout_js_val;
					self.manage_ajax_success( response.data, thiz_message_container );
					$( document ).trigger( event );
					if ( propagate ) {
						$( document ).trigger( 'js_wpv_save_section_queue' );
					} else {
						$( document ).trigger( 'js_event_wpv_set_confirmation_unload_check' );
					}
				} else {
					Toolset.hooks.doAction( 'wpv-action-wpv-edit-screen-manage-ajax-fail', { data: response.data, container: thiz_message_container} );
					self.save_fail_queue.push( 'save_section_loop_output' );
					if ( propagate ) {
						$( document ).trigger( 'js_wpv_save_section_queue' );
					}
				}
			},
			error:		function (ajaxContext) {
				thiz_message_container
					.wpvToolsetMessage({
						text:unsaved_message,
						type:'error',
						inline:true,
						stay:true
					});
				self.save_fail_queue.push( 'save_section_loop_output' );
				if ( propagate ) {
					$( document ).trigger( 'js_wpv_save_section_queue' );
				}
			},
			complete:	function() {
				spinnerContainer.remove();
			}
		});
	};
	
	self.save_callbacks['save_section_loop_output'] = {
		callback:	self.save_section_loop_output,
		event:		'js_event_wpv_save_section_loop_output_completed'
	};
	
	$( document ).on( 'click', '.js-wpv-layout-extra-update', function( e ) {
		e.preventDefault();
		self.save_section_loop_output( 'js_event_wpv_save_section_loop_output_completed', false );
	});
	
	// ---------------------------------
	// Content
	// ---------------------------------
	
	self.codemirror_content_track = function() {
		$('.js-wpv-content-update').parent().find('.toolset-alert-error').remove();
		if ( WPV_Toolset.CodeMirror_instance_value['wpv_content'] != WPV_Toolset.CodeMirror_instance['wpv_content'].getValue() ) {
			self.manage_save_queue( 'save_section_content', 'add' );
			$( '.js-wpv-content-update' )
				.prop('disabled', false)
				.removeClass('button-secondary')
				.addClass('button-primary js-wpv-section-unsaved');
			Toolset.hooks.doAction( 'wpv-action-wpv-edit-screen-set-confirm-unload', true );
		} else {
			self.manage_save_queue( 'save_section_content', 'remove' );
			$( '.js-wpv-content-update' )
				.prop('disabled', true)
				.removeClass('button-primary js-wpv-section-unsaved')
				.addClass('button-secondary');
			$( document ).trigger( 'js_event_wpv_set_confirmation_unload_check' );
		}
	};
	
	self.save_section_content = function( event, propagate ) {
		var thiz = $( '.js-wpv-content-update' ),
		content_val = WPV_Toolset.CodeMirror_instance['wpv_content'].getValue(),
		
		thiz_container = thiz.parents( '.js-wpv-settings-content' ),
		thiz_message_container = thiz_container.find( '.js-wpv-message-container' ),
		unsaved_message = thiz.data('unsaved'),
		nonce = thiz.data('nonce'),
		spinnerContainer = $('<div class="wpv-spinner ajax-loader">').insertBefore( thiz ).show();
		
		self.manage_save_queue( 'save_section_content', 'remove' );
		
		thiz_container.find('.toolset-alert-error').remove();
		thiz
			.prop( 'disabled', true )
			.removeClass( 'button-primary' )
			.addClass( 'button-secondary' );
		
		var data = {
			action:		'wpv_update_content',
			id:			self.view_id,
			content:	content_val,
			wpnonce:	nonce
		};
		
		$.ajax({
			type:		"POST",
			dataType:	"json",
			url:		ajaxurl,
			data:		data,
			success:	function( response ) {
				if ( response.success ) {
					thiz.removeClass('js-wpv-section-unsaved');
					WPV_Toolset.CodeMirror_instance_value['wpv_content'] = content_val;
					self.manage_ajax_success( response.data, thiz_message_container );
					$( document ).trigger( event );
					if ( propagate ) {
						$( document ).trigger( 'js_wpv_save_section_queue' );
					} else {
						$( document ).trigger( 'js_event_wpv_set_confirmation_unload_check' );
					}
				} else {
					Toolset.hooks.doAction( 'wpv-action-wpv-edit-screen-manage-ajax-fail', { data: response.data, container: thiz_message_container} );
					self.save_fail_queue.push( 'save_section_content' );
					if ( propagate ) {
						$( document ).trigger( 'js_wpv_save_section_queue' );
					}
				}
			},
			error:		function( ajaxContext ) {
				thiz_message_container
					.wpvToolsetMessage({
						text:unsaved_message,
						type:'error',
						inline:true,
						stay:true
					});
				self.save_fail_queue.push( 'save_section_content' );
				if ( propagate ) {
					$( document ).trigger( 'js_wpv_save_section_queue' );
				}
			},
			complete:	function() {
				spinnerContainer.remove();
			}
		});
	};
	
	self.save_callbacks['save_section_content'] = {
		callback:	self.save_section_content,
		event:		'js_event_wpv_save_section_content_completed'
	};
	
	$( document ).on( 'click', '.js-wpv-content-update', function( e ) {
		e.preventDefault();
		self.save_section_content( 'js_event_wpv_save_section_content_completed', false );
	});
	
	// Warning when the Content does not have a [wpv-filter-meta-html] shortcode
	
	self.fix_content_missing_filter_editor = function() {
		if ( WPV_Toolset.CodeMirror_instance_value['wpv_content'].search( 'wpv-filter-meta-html' ) == -1 ) {
			if ( ! $( '.js-wpv-screen-options-wrapper .js-wpv-show-hide-content' ).prop( 'checked' ) ) {
				$( '.js-wpv-screen-options-wrapper .js-wpv-show-hide-content' )
					.prop( 'checked', true )
					.trigger( 'change' );
			}
			var wpv_alert_content_missing_filter_editor = $( '.js-wpv-metasection-message-container.js-wpv-metasection-message-container-filter' ).wpvToolsetMessage({
				text:	wpv_editor_strings.toolset_alert.content_missing_filter_editor,
				type:	'error',
				inline:	false,
				stay:	true
			}),
			wpv_alert_content_missing_filter_editor_for_pagination = $( '.js-wpv-metasection-message-container.js-wpv-metasection-message-container-layout' ).wpvToolsetMessage({
				text:	wpv_editor_strings.toolset_alert.content_missing_filter_editor_for_pagination,
				type:	'error',
				inline:	false,
				stay:	true
			});
			$( document ).on( 'js_event_wpv_save_section_content_completed', function( event ) {
				if ( WPV_Toolset.CodeMirror_instance_value['wpv_content'].search( 'wpv-filter-meta-html' ) != -1 ) {
					wpv_alert_content_missing_filter_editor.remove();
					wpv_alert_content_missing_filter_editor_for_pagination.remove();
				}
			});
		}
		return self;
	};
	
	// ---------------------------------
	// Legacy - Layouts extra JavaScript files - track and update
	//
	// This is only available to users who already used it
	// ---------------------------------
	
	self.layout_extra_js_track = function() {
		$( '.js-wpv-layout-settings-extra-js-update' ).parent().find('.toolset-alert-error').remove();
		if ( self.model['.js-wpv-layout-settings-extra-js'] != $('.js-wpv-layout-settings-extra-js').val() ) {
			self.manage_save_queue( 'save_section_layout_extra_js', 'add' );
			$( '.js-wpv-layout-settings-extra-js-update' )
				.prop('disabled', false)
				.removeClass('button-secondary')
				.addClass('button-primary js-wpv-section-unsaved');
			Toolset.hooks.doAction( 'wpv-action-wpv-edit-screen-set-confirm-unload', true );
		} else {
			self.manage_save_queue( 'save_section_layout_extra_js', 'remove' );
			$( '.js-wpv-layout-settings-extra-js-update' )
				.prop('disabled', true)
				.removeClass('button-primary js-wpv-section-unsaved')
				.addClass('button-secondary');
			$( document ).trigger( 'js_event_wpv_set_confirmation_unload_check' );
		}
	};
	
	$( document ).on( 'keyup input cut paste', '.js-wpv-layout-settings-extra-js', function() {
		self.layout_extra_js_track();
	});
	
	self.save_section_layout_extra_js = function( event, propagate ) {
		var thiz = $( '.js-wpv-layout-settings-extra-js-update' ),
		extra_js = $('.js-wpv-layout-settings-extra-js').val(),
		
		thiz_container = thiz.parents( '.js-wpv-settings-layout-settings-extra-js' ),
		thiz_message_container = thiz_container.find( '.js-wpv-message-container' ),
		//update_message = thiz.data('success'),
		unsaved_message = thiz.data('unsaved'),
		nonce = thiz.data('nonce'),
		spinnerContainer = $('<div class="wpv-spinner ajax-loader">').insertBefore( thiz ).show();
		
		self.manage_save_queue( 'save_section_layout_extra_js', 'remove' );
		
		thiz_container.find('.toolset-alert-error').remove();
		thiz
			.prop( 'disabled', true )
			.removeClass( 'button-primary' )
			.addClass( 'button-secondary' );
		
		var data = {
			action:		'wpv_update_layout_extra_js',
			id:			self.view_id,
			value:		extra_js,
			wpnonce:	nonce
		};


		$.ajax({
			type:		"POST",
			dataType:	"json",
			url:		ajaxurl,
			data:		data,
			success:	function( response ) {
				if ( response.success ) {
					thiz.removeClass('js-wpv-section-unsaved');
					self.model['.js-wpv-layout-settings-extra-js'] = $('.js-wpv-layout-settings-extra-js').val();
					self.manage_ajax_success( response.data, thiz_message_container );
					$( document ).trigger( event );
					if ( propagate ) {
						$( document ).trigger( 'js_wpv_save_section_queue' );
					} else {
						$( document ).trigger( 'js_event_wpv_set_confirmation_unload_check' );
					}
				} else {
					Toolset.hooks.doAction( 'wpv-action-wpv-edit-screen-manage-ajax-fail', { data: response.data, container: thiz_message_container} );
					self.save_fail_queue.push( 'save_section_layout_extra_js' );
					if ( propagate ) {
						$( document ).trigger( 'js_wpv_save_section_queue' );
					}
				}
			},
			error:		function ( ajaxContext ) {
				thiz_message_container
					.wpvToolsetMessage({
						text:unsaved_message,
						type:'error',
						inline:true,
						stay:true
					});
				self.save_fail_queue.push( 'save_section_layout_extra_js' );
				if ( propagate ) {
					$( document ).trigger( 'js_wpv_save_section_queue' );
				}
			},
			complete:	function() {
				spinnerContainer.remove();
			}
		});
	};
	
	self.save_callbacks['save_section_layout_extra_js'] = {
		callback:	self.save_section_layout_extra_js,
		event:		'js_event_wpv_save_section_layout_extra_js_completed'
	};
	
	$( document ).on( 'click', '.js-wpv-layout-settings-extra-js-update', function( e ) {
		e.preventDefault();
		self.save_section_layout_extra_js( 'js_event_wpv_save_section_layout_extra_js_completed', false );
	});
	
	// ---------------------------------
	// Toggle boxes
	// ---------------------------------
	
	self.show_hide_toggle = function( thiz ) {
		$( '.' + thiz.data( 'target' ) ).slideToggle( 400, function() {
			thiz
				.find( '.js-wpv-toggle-toggler-icon i' )
					.toggleClass( 'icon-caret-down icon-caret-up fa-caret-down fa-caret-up' );
			$( document ).trigger( 'js_event_wpv_editor_metadata_toggle_toggled', [ thiz ] );
		});
	};
	
	$( document ).on( 'js_event_wpv_editor_metadata_toggle_toggled', function( event, toggler ) {
		var thiz_instance = toggler.data( 'instance' ),
		thiz_flag = toggler.find( '.js-wpv-textarea-full' ),
		this_toggler_icon = toggler.find( '.js-wpv-toggle-toggler-icon i' );
		thiz_flag.hide();
		if ( toggler.hasClass( 'js-wpv-assets-editor-toggle' ) ) {
			if ( ! toggler.hasClass( 'js-wpv-assets-editor-toggle-refreshed' ) ) {
				self.refresh_codemirror( thiz_instance );
				toggler.addClass( 'js-wpv-assets-editor-toggle-refreshed' );
			}
			if ( 
				self.asset_needs_flag( thiz_instance ) 
				&& (
					this_toggler_icon.hasClass( 'icon-caret-down' ) 
					|| this_toggler_icon.hasClass( 'fa-caret-down' ) 
				)
			) {
				thiz_flag.animate( {width: 'toggle'}, 200 );
			}
		}
	});
	
	self.asset_needs_flag = function( instance ) {
		if ( instance == 'filter-css-editor' ) {
			return ( WPV_Toolset.CodeMirror_instance['wpv_filter_meta_html_css'].getValue() != '' );
		} else if ( instance == 'filter-js-editor' ) {
			return ( WPV_Toolset.CodeMirror_instance['wpv_filter_meta_html_js'].getValue() != '' );
		} else if ( instance == 'layout-css-editor' ) {
			return ( WPV_Toolset.CodeMirror_instance['wpv_layout_meta_html_css'].getValue() != '' );
		} else if ( instance == 'layout-js-editor' ) {
			return ( WPV_Toolset.CodeMirror_instance['wpv_layout_meta_html_js'].getValue() != '' );
		}
	};
	
	$( document ).on( 'click', '.js-wpv-editor-instructions-toggle, .js-wpv-editor-metadata-toggle', function() {
		var thiz = $( this );
		self.show_hide_toggle( thiz );
	});
	
	// ---------------------------------
	// Pointers
	// ---------------------------------
	
	$( '.js-display-tooltip' ).click( function() {
		var thiz = $( this ),
		edge = ( $( 'html[dir="rtl"]' ).length > 0 ) ? 'right' : 'left';
		// hide this pointer if other pointer is opened.
		$( '.wp-toolset-pointer' ).fadeOut( 100 );
		thiz.pointer({
			pointerClass: 'wp-toolset-pointer wp-toolset-views-pointer',
			pointerWidth: 400,
			content: '<h3>'+thiz.data('header')+'</h3><p>'+thiz.data('content')+'</p>',
			position: {
				edge: edge,
				align: 'center',
				offset: '15 0'
			},
			buttons: function( event, t ) {
				var button_close = $('<button class="button button-primary-toolset alignright js-wpv-close-this">Close</button>');
				button_close.bind( 'click.pointer', function( e ) {
					e.preventDefault();
					t.element.pointer('close');
				});
				return button_close;
			}
		}).pointer('open');
	});
	
	$( document ).on( 'js_event_wpv_dismiss_pointer', function( event, pointer_name ) {
		var data = {
			action: 'wpv_dismiss_pointer',
			name: pointer_name
			//wpnonce : $(this).data('nonce')
		};
		$.ajax({
			type : "POST",
			url : ajaxurl,
			data : data,
			success : function( response ) {
				
			},
			error: function ( ajaxContext ) {
				
			},
			complete: function() {
				$( '.js-wpv-' + pointer_name + '-pointer' ).addClass( 'js-wpv-pointer-dismissed' );
			}
		});
	});
	
	// ---------------------------------
	// Toolset compatibility
	// ---------------------------------
	
	self.toolset_compatibility = function() {
		// CRED plugin
		if ( typeof cred_cred != 'undefined' ) {
			cred_cred.posts();
		}
		// Layouts plugin
		if ( $( '.js-wpv-display-in-iframe' ).length == 1 ) {
			if ( $( '.js-wpv-display-in-iframe' ).val() == 'yes' ) {
				$( '.toolset-help a, .wpv-setting a' ).attr( "target", "_blank" );
			}
		}
		//Legacy WordPress Archives without a Filter shortcode in its content
		self.fix_content_missing_filter_editor();
	};
	
	/**
	* init_third_party
	*
	* Init third party callbacks.
	*
	* @since 2.1
	*/
	
	self.init_third_party = function() {
		// toolset_select2 in orderby dropdowns
		$( 'select.js-wpv-posts-orderby' ).toolset_select2(
			{ 
				width:				'resolve',
				dropdownAutoWidth:	true 
			}
		)
		.data( 'toolset_select2' )
				.$dropdown
					.addClass( 'toolset_select2-dropdown-in-setting' );
		// Admin menu link target
		$( '#adminmenu li.current a' ).attr( 'href', $( '#adminmenu li.current a' ).attr( 'href' ) + '&view_id=' + self.view_id );
	};
	
	// ---------------------------------
	// Dialogs
	// ---------------------------------
	
	self.init_dialogs = function() {
		self.post_types_for_archive_loops_dialog = $( "#js-wpv-wpa-hidden-dialogs-container #js-wpv-dialog-assign-post-type-to-archive-loop-dialog" ).dialog({
			autoOpen:	false,
			modal:		true,
			title:		wpv_editor_strings.dialog.post_types_for_archive_loop.title,
			minWidth:	self.dialog_minWidth,
			draggable:	false,
			resizable:	false,
			show: { 
				effect:		"blind", 
				duration:	800 
			},
			open:		function( event, ui ) {
				$( 'body' ).addClass( 'modal-open' );
			},
			close:		function( event, ui ) {
				self.apply_post_types_to_loop_data = {
					type:			'',
					name:			'',
					'default_pt':	[],
					'selected_pt':	[]
				};
				$( '.js-wpv-post-types-for-archive-loop' ).prop( 'checked', false );
				$( 'body' ).removeClass( 'modal-open' );
			},
			buttons:[
				{
					class:	'button-secondary',
					text:	wpv_editor_strings.dialog.cancel,
					click:	function() {
						$( this ).dialog( "close" );
					}
				},
				{
					class:	'button-secondary',
					text:	wpv_editor_strings.dialog.restore,
					click:	function() {
						self.restore_post_types_to_archive_loop();
					}
				},
				{
					class:	'button-primary js-wpv-apply-post-types-to-archive-loop',
					text:	wpv_editor_strings.dialog.apply,
					click:	function() {
						self.apply_post_types_to_archive_loop();
					}
				}
			]
		});
		self.archive_pagination_dialog = $( "#js-wpv-wpa-hidden-dialogs-container #js-wpv-archive-pagination-dialog" ).dialog({
			autoOpen:	false,
			modal:		true,
			title:		wpv_editor_strings.dialog_pagination.title,
			minWidth:	self.dialog_minWidth,
			draggable:	false,
			resizable:	false,
			show: { 
				effect:		"blind", 
				duration:	800 
			},
			open:		function( event, ui ) {
				$( 'body' ).addClass( 'modal-open' );
				self.init_pagination_dialog_options();
			},
			close:		function( event, ui ) {
				$( 'body' ).removeClass( 'modal-open' );
			},
			buttons:[
				{
					class: 'button-secondary',
					text: wpv_editor_strings.dialog.cancel,
					click: function() {
						$( this ).dialog( "close" );
					}
				},
				{
					class: 'button-primary js-wpv-insert-archive-pagination',
					text: wpv_editor_strings.dialog_pagination.insert,
					click: function() {

					}
				}
			]
		});
		
		/**
		 * Dialog for the frontend sorting controls.
		 *
		 * @since 2.3.0
		 */
		
		self.sorting_dialog = $( "#js-wpv-shared-hidden-dialogs-container #js-wpv-frontend-sorting-dialog" ).dialog({
			autoOpen:	false,
			modal:		true,
			title:		wpv_editor_strings.dialog_sorting.title,
			minWidth:	self.calculate_dialog_maxWidth(),
			draggable:	false,
			resizable:	false,
			show: { 
				effect:		"blind", 
				duration:	800 
			},
			create: function( event, ui ) {
				$( event.target ).parent().css( 'position', 'fixed' );
			},
			open:		function( event, ui ) {
				$( 'body' ).addClass( 'modal-open' );
				self.populate_sorting_dialog_options();
			},
			close:		function( event, ui ) {
				$( 'body' ).removeClass( 'modal-open' );
				self.restore_sorting_dialog_options();
			},
			buttons:[
				{
					class: 'button-secondary toolset-shortcode-gui-dialog-button-close',
					text: wpv_editor_strings.dialog.cancel,
					click: function() {
						$( this ).dialog( "close" );
					}
				},
				{
					class: 'button-primary',
					text: wpv_editor_strings.dialog_sorting.insert,
					click: function() {
						self.insert_sorting_controls();
					}
				}
			]
		});
		
		self.frontend_events_dialog = $( "#js-wpv-dialog-views-frontend-events" ).dialog({
			autoOpen:	false,
			modal:		true,
			title:		wpv_editor_strings.frontend_events_dialog_title,
			minWidth:	self.dialog_minWidth,
			draggable:	false,
			resizable:	false,
			show: { 
				effect: "blind", 
				duration: 800 
			},
			open: function( event, ui ) {
				$( 'body' ).addClass( 'modal-open' );
				self.manage_frontend_events_dialog_button();
				$('.js-wpv-shortcode-gui-tabs')
                    .tabs()
                    .addClass('ui-tabs-vertical ui-helper-clearfix')
                    .removeClass('ui-corner-top ui-corner-right ui-corner-bottom ui-corner-left ui-corner-all');
				$('#js-wpv-shortcode-gui-dialog-tabs ul, #js-wpv-shortcode-gui-dialog-tabs li').removeClass('ui-corner-top ui-corner-right ui-corner-bottom ui-corner-left ui-corner-all');
			},
			close: function( event, ui ) {
				$( 'body' ).removeClass( 'modal-open' );
			},
			buttons:[
				{
					class: 'button-secondary js-wpv-frontend-events-close',
					text: wpv_editor_strings.dialog_close,
					click: function() {
						$( this ).dialog( "close" );
					}
				},
				{
					class: 'button-primary js-wpv-frontend-events-insert',
					text: wpv_editor_strings.add_event_trigger_callback_dialog_insert,
					click: function() {
						self.insert_frontend_event_handler();
					}
				}
			]
		});
	};
	
	// ---------------------------------
	// Save all
	// ---------------------------------
	
	$( document ).on( 'js_wpv_save_section_queue_completed', function( event ) {
		
		$( '.js-wpv-view-save-all-spinner' ).remove();
		self.save_all_queue_step		= 0;
		self.save_all_queue_completed	= 100;
		self.save_all_progress_bar
			.removeClass( 'wpv-view-save-all-progress-working' )
			.css({
				'width': '100%'
			});
		// Determine the overall result.
		var is_queue_successfull = ( self.save_fail_queue.length == 0 ),
		action_bar_class = ( is_queue_successfull ? 'wpv-action-success' : 'wpv-action-failure' );
		
		self.save_fail_queue = [];
		
		// Display success/failure message.
		if ( is_queue_successfull ) {
			//noinspection JSUnresolvedVariable
			self.manage_action_bar_success({message: wpv_editor_strings.sections_saved});
		} else {
			//noinspection JSUnresolvedVariable
			self.manage_action_bar_error( { message: wpv_editor_strings.some_section_unsaved, stay: false } );
		}

		// Highlight the action bar
		$( '.js-wpv-general-actions-bar' ).addClass( action_bar_class );
		setTimeout( function () {
			$( '.js-wpv-general-actions-bar' ).removeClass( action_bar_class );
			self.save_all_progress_bar.css({
				'width': '0'
			});
		}, 1000 );
		
	});
	
	$( document ).on( 'click', '.js-wpv-view-save-all', function( e ) {
		e.preventDefault();
		var thiz = $( this ),
		spinnerContainerAll = $('<div class="wpv-spinner ajax-loader js-wpv-view-save-all-spinner">').insertBefore( thiz ).show();
		
		thiz
			.prop('disabled', true).
			removeClass('button-primary')
			.addClass('button-secondary');
		
		if ( _.size( self.save_queue ) > 0 ) {
			self.save_all_queue_step = Math.round( 100 / _.size( self.save_queue ) );
		}
		
		$( document ).trigger( 'js_wpv_save_section_queue' );
	});
	
	// ---------------------------------
	// Warning when clicking away on unsaved changes
	// ---------------------------------
	
	$( document ).on( 'js_event_wpv_set_confirmation_unload_check', function( event ) {
		if ( $( '.js-wpv-section-unsaved' ).length < 1 ) {
			Toolset.hooks.doAction( 'wpv-action-wpv-edit-screen-set-confirm-unload', false );
		}	
	});
	
	self.set_confirm_unload = function( on ) {
		if (
			on 
			&& $( '.js-wpv-section-unsaved' ).length > 0
		) {
			window.onbeforeunload = function( e ) {
				$( '.js-wpv-section-unsaved' ).each( function() {
					var unsaved_message = $(this).data('unsaved');
					if ($(this).parents('.js-wpv-update-button-wrap').find('.toolset-alert-error').length < 1) {
						// @todo review this message, it needs to be attached to a dedicated empty container
						$(this)
							.parents('.js-wpv-update-button-wrap')
								.find('.js-wpv-message-container')
									.wpvToolsetMessage({
										text:unsaved_message,
										type:'error',
										inline:true,
										stay:true
									});
					}
				});
				var message = 'You have entered new data on this page.';
				// For IE and Firefox prior to version 4
				if (e) {
					e.returnValue = message;
				}
				// For Safari
				//	var e = event || window.event;
				return message;
			}
			$('.js-wpv-view-save-all').prop('disabled', false).removeClass('button-secondary').addClass('button-primary');
			$(document).trigger( 'js_event_wpv_set_confirmation_unload_done', [ true ] );
		} else {
			window.onbeforeunload = null;
			$('.js-wpv-view-save-all, .js-wpv-section-unsaved').prop('disabled', true).removeClass('button-primary').addClass('button-secondary');
			$(document).trigger( 'js_event_wpv_set_confirmation_unload_done', [ false ] );
		}
	};

	// ---------------------------------
	// Init
	// ---------------------------------
	
	self.init = function() {
		// Init the model
		self.init_model();
		// Init hooks
		self.init_hooks();
		// Init cache
		self.init_cache();
		// Init help
		self.init_loop_selection_help();
		// Init CodeMirror editors save shortcut, tracking, and refresh
		self.init_codemirror();
		// Title placeholder
		self.title_placeholder();
        // Random order and pagination incompatible
        self.sorting_random_and_pagination();
		// Toolset compatibility
		self.toolset_compatibility();
		// Init third-party
		self.init_third_party();
		// Init dialogs
		self.init_dialogs();
	};
	
	self.init();

};

jQuery( document ).ready( function( $ ) {
    WPViews.wpa_edit_screen = new WPViews.WPAEditScreen( $ );
});

/**
* Quicktags custom implementation fallback
*/

if ( typeof WPV_Toolset.add_qt_editor_buttons !== 'function' ) {
    WPV_Toolset.add_qt_editor_buttons = function( qt_instance, editor_instance ) {
		var activeUrlEditor;
        QTags._buttonsInit();
		if ( typeof WPV_Toolset.CodeMirror_instance[qt_instance.id] === "undefined" ) {
			WPV_Toolset.CodeMirror_instance[qt_instance.id] = editor_instance;
		}
        for ( var button_name in qt_instance.theButtons ) {
			if ( qt_instance.theButtons.hasOwnProperty( button_name ) ) {
				qt_instance.theButtons[button_name].old_callback = qt_instance.theButtons[button_name].callback;
                if ( qt_instance.theButtons[button_name].id == 'img' ){
                    qt_instance.theButtons[button_name].callback = function( element, canvas, ed ) {
						var t = this,
						id = jQuery( canvas ).attr( 'id' ),
						selection = WPV_Toolset.CodeMirror_instance[id].getSelection(),
						e = "http://",
						g = prompt( quicktagsL10n.enterImageURL, e ),
						f = prompt( quicktagsL10n.enterImageDescription, "" );
						t.tagStart = '<img src="' + g + '" alt="' + f + '" />';
						selection = t.tagStart;
						t.closeTag( element, ed );
						WPV_Toolset.CodeMirror_instance[id].replaceSelection( selection, 'end' );
						WPV_Toolset.CodeMirror_instance[id].focus();
                    }
                } else if ( qt_instance.theButtons[button_name].id == 'wpv_conditional' ) {
                    qt_instance.theButtons[button_name].callback = function ( e, c, ed ) {                     
                        WPV_Toolset.activeUrlEditor = ed;                        
						var id = jQuery( c ).attr( 'id' ),
                        t = this;
                        window.wpcfActiveEditor = id;
                        WPV_Toolset.CodeMirror_instance[id].focus();
                        selection = WPV_Toolset.CodeMirror_instance[id].getSelection();
						var current_editor_object = {};
						if ( selection ) {
						   //When texty selected
						   current_editor_object = {'e' : e, 'c' : c, 'ed' : ed, 't' : t, 'post_id' : '', 'close_tag' : true, 'codemirror' : id};
						   WPViews.shortcodes_gui.wpv_insert_popup_conditional('wpv-conditional', wpv_shortcodes_gui_texts.wpv_insert_conditional_shortcode, {}, wpv_shortcodes_gui_texts.wpv_editor_callback_nonce, current_editor_object );
						} else if ( ed.openTags ) {
							// if we have an open tag, see if it's ours
							var ret = false, i = 0, t = this;
							while ( i < ed.openTags.length ) {
								ret = ed.openTags[i] == t.id ? i : false;
								i ++;
							}
							if ( ret === false ) {
								t.tagStart = '';
								t.tagEnd = false;                
								if ( ! ed.openTags ) {
									ed.openTags = [];
								}
								ed.openTags.push(t.id);
								e.value = '/' + e.value;
								current_editor_object = {'e' : e, 'c' : c, 'ed' : ed, 't' : t, 'post_id' : '', 'close_tag' : false, 'codemirror' : id};
								WPViews.shortcodes_gui.wpv_insert_popup_conditional('wpv-conditional', wpv_shortcodes_gui_texts.wpv_insert_conditional_shortcode, {}, wpv_shortcodes_gui_texts.wpv_editor_callback_nonce, current_editor_object );
							} else {
								// close tag
								ed.openTags.splice(ret, 1);
								t.tagStart = '[/wpv-conditional]';
								e.value = t.display;
								window.icl_editor.insert( t.tagStart );
							}
						} else {
							// last resort, no selection and no open tags
							// so prompt for input and just open the tag           
							t.tagStart = '';
							t.tagEnd = false;
							if ( ! ed.openTags ) {
								ed.openTags = [];
							}
							ed.openTags.push(t.id);
							e.value = '/' + e.value;
							current_editor_object = {'e' : e, 'c' : c, 'ed' : ed, 't' : t, 'post_id' : '', 'close_tag' : false, 'codemirror' : id};
							WPViews.shortcodes_gui.wpv_insert_popup_conditional('wpv-conditional', wpv_shortcodes_gui_texts.wpv_insert_conditional_shortcode, {}, wpv_shortcodes_gui_texts.wpv_editor_callback_nonce, current_editor_object );
						}
					}
                } else if ( qt_instance.theButtons[button_name].id == 'close' ) {
                    
                } else if ( qt_instance.theButtons[button_name].id == 'link' ) {
					var t = this;
					qt_instance.theButtons[button_name].callback = function ( b, c, d, e ) {
						activeUrlEditor = c;var f,g=this;return"undefined"!=typeof wpLink?void wpLink.open(d.id):(e||(e="http://"),void(g.isOpen(d)===!1?(f=prompt(quicktagsL10n.enterURL,e),f&&(g.tagStart='<a href="'+f+'">',a.TagButton.prototype.callback.call(g,b,c,d))):a.TagButton.prototype.callback.call(g,b,c,d)))
					};
					jQuery( '#wp-link-submit' ).off();
					jQuery( '#wp-link-submit' ).on( 'click', function( event ) {
						event.preventDefault();
						var id = jQuery( activeUrlEditor ).attr('id'),
						selection = WPV_Toolset.CodeMirror_instance[id].getSelection(),
						inputs = {},
						attrs, text, title, html;
						inputs.wrap = jQuery('#wp-link-wrap');
						inputs.backdrop = jQuery( '#wp-link-backdrop' );
						if ( jQuery( '#link-target-checkbox' ).length > 0 ) {
							// Backwards compatibility - before WordPress 4.2
							inputs.text = jQuery( '#link-title-field' );
							attrs = wpLink.getAttrs();
							text = inputs.text.val();
							if ( ! attrs.href ) {
								return;
							}
							// Build HTML
							html = '<a href="' + attrs.href + '"';
							if ( attrs.target ) {
								html += ' target="' + attrs.target + '"';
							}
							if ( text ) {
								title = text.replace( /</g, '&lt;' ).replace( />/g, '&gt;' ).replace( /"/g, '&quot;' );
								html += ' title="' + title + '"';
							}
							html += '>';
							html += text || selection;
							html += '</a>';
							t.tagStart = html;
							selection = t.tagStart;
						} else {
							// WordPress 4.2+
							inputs.text = jQuery( '#wp-link-text' );
							attrs = wpLink.getAttrs();
							text = inputs.text.val();
							if ( ! attrs.href ) {
								return;
							}
							// Build HTML
							html = '<a href="' + attrs.href + '"';
							if ( attrs.target ) {
								html += ' target="' + attrs.target + '"';
							}
							html += '>';
							html += text || selection;
							html += '</a>';
							selection = html;
						}
						jQuery( document.body ).removeClass( 'modal-open' );
						inputs.backdrop.hide();
						inputs.wrap.hide();
						jQuery( document ).trigger( 'wplink-close', inputs.wrap );
						WPV_Toolset.CodeMirror_instance[id].replaceSelection( selection, 'end' );
						WPV_Toolset.CodeMirror_instance[id].focus();
						return false;
                    });
                } else {
                    qt_instance.theButtons[button_name].callback = function( element, canvas, ed ) {                    
                        var id = jQuery( canvas ).attr( 'id' ),
                        t = this,
                        selection = WPV_Toolset.CodeMirror_instance[id].getSelection();
						if ( selection.length > 0 ) { 
							if ( !t.tagEnd ) {
								selection = selection + t.tagStart;
							} else {
								selection = t.tagStart + selection + t.tagEnd;
							}
						} else {
							if ( !t.tagEnd ) {
								selection = t.tagStart;
							} else if ( t.isOpen( ed ) === false ) {
								selection = t.tagStart;
								t.openTag( element, ed );
							} else {
								selection = t.tagEnd;
								t.closeTag( element, ed );
							}
						}
                        WPV_Toolset.CodeMirror_instance[id].replaceSelection(selection, 'end');
                        WPV_Toolset.CodeMirror_instance[id].focus();
                    }
                }
			}
		}
    }
}
