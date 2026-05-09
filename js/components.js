/**
 * Dynamic Component Loader
 * Loads header and footer components dynamically into HTML pages
 */
(function() {
  'use strict';

  // Component paths (relative to the root)
  var COMPONENTS = {
    header: './components/header.html',
    footer: './components/footer.html'
  };

  // Cache for loaded components
  var componentCache = {};

  /**
   * Load a component from file or cache
   */
  function loadComponent(name) {
    return new Promise(function(resolve, reject) {
      // Check cache first
      if (componentCache[name]) {
        resolve(componentCache[name]);
        return;
      }

      var path = COMPONENTS[name];
      if (!path) {
        reject(new Error('Component not found: ' + name));
        return;
      }

      // Fetch the component
      fetch(path)
        .then(function(response) {
          if (!response.ok) {
            throw new Error('Failed to load component: ' + name);
          }
          return response.text();
        })
        .then(function(html) {
          componentCache[name] = html;
          resolve(html);
        })
        .catch(function(error) {
          console.error('Error loading component ' + name + ':', error);
          reject(error);
        });
    });
  }

  /**
   * Insert component HTML into the placeholder
   */
  function insertComponent(placeholder, html) {
    if (!placeholder || !html) return;
    
    // Insert the HTML
    placeholder.insertAdjacentHTML('beforebegin', html);
    
    // Remove the placeholder
    placeholder.remove();
  }

  /**
   * Initialize component loading
   */
  function init() {
    var headerPlaceholder = document.getElementById('component-header');
    var footerPlaceholder = document.getElementById('component-footer');

    var promises = [];

    // Load header if placeholder exists
    if (headerPlaceholder) {
      promises.push(
        loadComponent('header').then(function(html) {
          insertComponent(headerPlaceholder, html);
        }).catch(function() {
          // On failure, show a fallback message
          headerPlaceholder.innerHTML = '<p style="color: red; padding: 20px; text-align: center;">Header component failed to load.</p>';
        })
      );
    }

    // Load footer if placeholder exists
    if (footerPlaceholder) {
      promises.push(
        loadComponent('footer').then(function(html) {
          insertComponent(footerPlaceholder, html);
        }).catch(function() {
          // On failure, show a fallback message
          footerPlaceholder.innerHTML = '<p style="color: red; padding: 20px; text-align: center;">Footer component failed to load.</p>';
        })
      );
    }

    // Wait for all components to load, then dispatch event
    Promise.all(promises).then(function() {
      // Dispatch custom event when components are ready
      document.dispatchEvent(new CustomEvent('components:loaded'));
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose API for manual loading if needed
  window.SiteComponents = {
    load: loadComponent,
    cache: componentCache
  };

})();