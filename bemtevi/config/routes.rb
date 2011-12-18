Rails.application.routes.draw do

  namespace :btv_api do
    resources :products, :except => [:new,:edit,:delete]
    resources :promotions, :except => [:new,:edit,:delete]
    resources :users, :except => [:new,:edit,:delete]
    resources :images, :except => [:new,:edit,:delete]
    resources :taxonomies, :except => [:new,:edit,:delete]
    resources :taxons, :except => [:new,:edit,:delete]
    resources :vendors, :except => [:new,:edit,:delete]
  end

  namespace :admin do
    resources :products do
      resources :images do
        resources :image_overlays
      end
    end
    resources :vendors do
      resources :vendor_images do
        collection do
          post :update_positions
        end
      end
    end
    resources :promotions do
      resources :promotion_images do
        collection do
          post :update_positions
        end
      end
    end
  end

  match '/admin' => 'admin/promotions#index', :as => :admin

end
