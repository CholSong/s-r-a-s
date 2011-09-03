class BemteviHooks < Spree::ThemeSupport::HookListener
  # custom hooks go here
  remove :admin_product_sub_tabs
  replace :admin_tabs, 'admin/shared/tabs'
end