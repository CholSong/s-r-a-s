User.class_eval do
  has_many :taxonomies
  has_many :addresses
  
  attr_accessible :email, :password, :password_confirmation, :name, :addresses, :taxonomies, :remember_me, :persistence_token

end