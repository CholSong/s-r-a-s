Rails.application.routes.draw do

  namespace :btv_api do
    resource :dump, :only => [:show]
    resources :products, :except => [:new,:edit,:delete]
    resources :promotions, :except => [:new,:edit,:delete]
    resources :users, :except => [:new,:edit,:delete]
    resources :images, :except => [:new,:edit,:delete]
    resources :taxonomies, :except => [:new,:edit,:delete]
    resources :taxons, :except => [:new,:edit,:delete]
    resources :vendors, :except => [:new,:edit,:delete]
  end

  namespace :manager do
    resources :promotions do
      member do 
        post :create
      end
      collection do 
        get :templates
        get :promotions
      end
    end
    resources :image_template_sets do
    end
  end


  namespace :admin do
    resources :products do
      resources :images
    end
    resources :vendors do
      resources :vendor_images do
        collection do
          post :update_positions
        end
      end
      resources :taxons do
        member do
          get :select
          delete :remove
        end
        collection do
          post :available
          post :batch_select
          get  :selected
        end
      end
    end
    resources :image_template_sets do
    end
    resources :promotions do
      resources :promotion_images do
        collection do
          post :update_positions
        end
      end
      resources :taxons do
        member do
          get :select
          delete :remove
        end
        collection do
          post :available
          post :batch_select
          get  :selected
        end
      end
    end
  end

  match '/admin' => 'admin/promotions#index', :as => :admin

end
