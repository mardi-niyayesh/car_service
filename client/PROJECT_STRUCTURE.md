# 📁 Project Structure - AutoRent Client (React + TypeScript + Vite)

```
client-root/
├── 📁 src/
│   ├── 📁 components/
│   │   ├── 📁 common/                 # Shared/reusable components
│   │   │   ├── 📄 AuthForm.tsx
│   │   │   ├── 📄 ErrorModal.tsx
│   │   │   ├── 📄 FormInput.tsx
│   │   │   ├── 📄 SuccessModal.tsx
│   │   │   └── 📄 WarningModal.tsx
│   │   │
│   │   ├── 📁 Footer/
│   │   │   └── 📄 Footer.tsx
│   │   │
│   │   ├── 📁 Header/
│   │   │   ├── 📄 BanerHeader.tsx
│   │   │   ├── 📄 ContainerHeader.tsx
│   │   │   ├── 📄 ContainerMenuHeader.tsx
│   │   │   ├── 📄 HeaderSite.tsx
│   │   │   └── 📁 components/         # Header sub-components
│   │   │       ├── 📄 AuthButton.tsx
│   │   │       ├── 📄 Basket.tsx
│   │   │       ├── 📄 Logo.tsx
│   │   │       ├── 📄 MenuHeader.tsx
│   │   │       └── 📄 SearchButton.tsx
│   │   │
│   │   ├── 📁 Main/                    # Landing page components
│   │   │   ├── 📄 CarParts.tsx
│   │   │   ├── 📄 ComponentReservAutorent.tsx
│   │   │   ├── 📄 Desctiption.tsx
│   │   │   ├── 📄 DesctiptionComponent.tsx
│   │   │   ├── 📄 DetailCarService.tsx
│   │   │   ├── 📄 HeroBaner.tsx
│   │   │   ├── 📄 MainSite.tsx
│   │   │   ├── 📄 Modal.tsx
│   │   │   ├── 📄 WhyAutoRent.tsx
│   │   │   ├── 📁 Article/
│   │   │   │   ├── 📄 ArticleCar.tsx
│   │   │   │   └── 📄 ComponentArticleCar.tsx
│   │   │   └── 📁 Question/
│   │   │       ├── 📄 BoxComponentQuestion.tsx
│   │   │       └── 📄 ComponentQuestion.tsx
│   │   │
│   │   ├── 📁 Product/                 # Product listing & cards
│   │   │   └── 📄 Product.tsx
│   │   │
│   │   └── 📁 ReserveCar/              # Car reservation flow
│   │       ├── 📄 CarComponent.tsx
│   │       ├── 📄 DesCar.tsx
│   │       ├── 📄 IconDetailCar.tsx
│   │       ├── 📄 ReserveComponent.tsx
│   │       ├── 📁 Details/
│   │       │   ├── 📄 DetailCarComponent.tsx
│   │       │   ├── 📄 GaleryCarComponent.tsx
│   │       │   └── 📄 PriceComponent.tsx
│   │       └── 📁 Pages/               # City-specific pages
│   │           ├── 📄 MashhadPage.tsx
│   │           ├── 📄 Nayshaboor.tsx
│   │           ├── 📄 ProductDetailsPage.tsx
│   │           ├── 📄 QeshmPage.tsx
│   │           ├── 📄 SaryPage.tsx
│   │           ├── 📄 ShirazPage.tsx
│   │           ├── 📄 TabrizPage.tsx
│   │           └── 📄 YazdPage.tsx
│   │
│   ├── 📁 ComponentPublic/             # Public shared components
│   │   └── 📄 Comment.tsx
│   │
│   ├── 📁 Context/                     # React Context providers
│   │   ├── 📄 UserContext.tsx
│   │   └── 📄 UserProvider.tsx
│   │
│   ├── 📁 dashboard/                   # User dashboard module
│   │   ├── 📁 Api/
│   │   │   ├── 📄 ApiLogoutUser.tsx
│   │   │   ├── 📄 ApiUpdatPassword.tsx
│   │   │   └── 📄 ApiUpdatUser.tsx
│   │   ├── 📁 Components/
│   │   │   ├── 📄 ComponentFormUpdateUser.tsx
│   │   │   ├── 📄 ComponnetUpdetePassword.tsx
│   │   │   ├── 📄 DashboardLayout.tsx
│   │   │   ├── 📄 DashboardSidebar.tsx
│   │   │   ├── 📄 HeaderDashbord.tsx
│   │   │   ├── 📄 Profile.tsx
│   │   │   └── 📄 WalletComponents.tsx
│   │   ├── 📁 Pages/
│   │   │   ├── 📄 AddressPages.tsx
│   │   │   ├── 📄 CardPages.tsx
│   │   │   ├── 📄 CommentPages.tsx
│   │   │   ├── 📄 LogoutPage.tsx
│   │   │   ├── 📄 ReservePages.tsx
│   │   │   └── 📄 WalletPages.tsx
│   │   └── 📁 Types/
│   │       └── 📄 Dashboard.type.ts
│   │
│   ├── 📁 hooks/                       # Custom React hooks
│   │   └── 📄 useUser.ts
│   │
│   ├── 📁 Layouts/                     # Layout wrappers
│   │   ├── 📄 AuthLayout.tsx
│   │   └── 📄 MainLayout.tsx
│   │
│   ├── 📁 pages/                       # Public pages (routed)
│   │   ├── 📄 AboutPage.tsx
│   │   ├── 📄 ContactPage.tsx
│   │   ├── 📄 ForgotPasswordPage.tsx
│   │   ├── 📄 HomePage.tsx
│   │   ├── 📄 LoginPage.tsx
│   │   ├── 📄 NotFoundPage.tsx
│   │   ├── 📄 QuestionPage.tsx
│   │   ├── 📄 RegisterPage.tsx
│   │   ├── 📄 ResetPasswordPage.tsx
│   │   └── 📄 RolsPage.tsx
│   │
│   ├── 📁 PanelAdmin/                  # Admin panel module
│   │   ├── 📁 Api/
│   │   │   └── 📄 UserService.tsx
│   │   ├── 📁 Components/
│   │   │   ├── 📄 ComponentCategoryProduct.tsx
│   │   │   ├── 📄 ComponentDatailUser.tsx
│   │   │   ├── 📄 ComponentFormAddProduct.tsx
│   │   │   ├── 📄 ComponentsPanelAdmin.tsx
│   │   │   ├── 📄 ComponentTableCategory.tsx
│   │   │   ├── 📄 ComponentTableProduct.tsx
│   │   │   ├── 📄 ComponentTableUser.tsx
│   │   │   └── 📄 PanelAdminLayout.tsx
│   │   └── 📁 Pages/
│   │       ├── 📄 CategoryPage.tsx
│   │       ├── 📄 CreatCustomRolePage.tsx
│   │       ├── 📄 DescriptionRolePage.tsx
│   │       ├── 📄 DetalisUserPage.tsx
│   │       ├── 📄 ProductPage.tsx
│   │       ├── 📄 RolesPage.tsx
│   │       └── 📄 UsersPage.tsx
│   │
│   ├── 📁 Routes/                      # Route guards & configuration
│   │   └── 📄 GaurdRoute.tsx
│   │
│   ├── 📁 services/                    # API service layer
│   │   ├── 📄 api.tsx
│   │   ├── 📄 authService.ts
│   │   └── 📄 axiosClient.ts
│   │
│   ├── 📁 types/                       # Global TypeScript types
│   │   └── 📄 auth.types.ts
│   │
│   ├── 📄 App.tsx
│   ├── 📄 index.css
│   ├── 📄 main.tsx
│   └── 📄 vite-env.d.ts
│
├── 📄 .gitignore
├── 📄 PROJECT_STRUCTURE.md
├── 📄 eslint.config.js
├── 📄 index.html
├── 📄 package.json
├── 📄 package-lock.json
├── 📄 README.md
├── 📄 tsconfig.app.json
├── 📄 tsconfig.json
├── 📄 tsconfig.node.json
└── 📄 vite.config.ts
```
