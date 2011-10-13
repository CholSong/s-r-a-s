Rails.application.routes.draw do
  namespace :api2 do
      resources :products, :except => [:new,:edit,:delete]
      resources :promotions, :except => [:new,:edit,:delete]
      resources :users, :except => [:delete]
      resources :images
  end
  
  namespace :admin do
    resources :products do
      resources :images do
        resources :image_overlays
      end
    end
  end

  match '/admin' => 'admin/products#index', :as => :admin

end
