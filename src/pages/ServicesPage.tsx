import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Palette, 
  Layers, 
  Smartphone, 
  Image, 
  FileText,
  Layout,
  MessageCircle,
  ArrowRight,
  Monitor,
  ShoppingCart,
  Search,
  Share2,
  PenTool,
  Code,
  Zap,
  CheckCircle,
  Video,
  TrendingUp,
  Target,
  BarChart3,
  Film,
  Clapperboard,
  Megaphone,
  Users,
  Laptop,
  FileSpreadsheet,
  Presentation,
  Database,
  Printer
} from "lucide-react";
import LayoutComponent from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";

const ServicesPage = () => {
  const { t } = useLanguage();

  const allServices = [
    { 
      icon: Layout, 
      titleKey: "service.uiux.title", 
      descKey: "service.uiux.desc",
      features: ["feature.userResearch", "feature.wireframing", "feature.prototyping", "feature.userTesting"]
    },
    { 
      icon: Search, 
      titleKey: "service.seo.title", 
      descKey: "service.seo.desc",
      features: ["feature.keywordResearch", "feature.onPageSeo", "feature.technicalSeo", "feature.analytics"]
    },
    { 
      icon: Monitor, 
      titleKey: "service.web.title", 
      descKey: "service.web.desc",
      features: ["feature.customDesign", "feature.responsiveLayout", "feature.cmsIntegration", "feature.performance"]
    },
    { 
      icon: ShoppingCart, 
      titleKey: "service.ecommerce.title", 
      descKey: "service.ecommerce.desc",
      features: ["feature.productCatalog", "feature.paymentGateway", "feature.inventorySystem", "feature.analytics"]
    },
    { 
      icon: Share2, 
      titleKey: "service.social.title", 
      descKey: "service.social.desc",
      features: ["feature.contentStrategy", "feature.postDesign", "feature.storyTemplates", "feature.brandGuidelines"]
    },
    { 
      icon: PenTool, 
      titleKey: "service.branding.title", 
      descKey: "service.branding.desc",
      features: ["feature.logoDesign", "feature.brandIdentity", "feature.styleGuide", "feature.marketingMaterials"]
    },
    { 
      icon: Video, 
      titleKey: "service.video.title", 
      descKey: "service.video.desc",
      features: ["feature.promotionalVideos", "feature.socialMediaReels", "feature.motionGraphics", "feature.colorGrading"]
    },
    { 
      icon: TrendingUp, 
      titleKey: "service.marketing.title", 
      descKey: "service.marketing.desc",
      features: ["feature.socialMediaAds", "feature.googleAds", "feature.emailMarketing", "feature.contentMarketing"]
    },
    { 
      icon: Laptop, 
      titleKey: "service.computer.title", 
      descKey: "service.computer.desc",
      features: ["feature.msOfficeExpert", "feature.dataEntry", "feature.documentFormatting", "feature.spreadsheetManagement"]
    },
  ];

  const computerServices = [
    { icon: FileSpreadsheet, titleKey: "computer.excel.title", descKey: "computer.excel.desc" },
    { icon: FileText, titleKey: "computer.word.title", descKey: "computer.word.desc" },
    { icon: Presentation, titleKey: "computer.ppt.title", descKey: "computer.ppt.desc" },
    { icon: Database, titleKey: "computer.data.title", descKey: "computer.data.desc" },
    { icon: Printer, titleKey: "computer.doc.title", descKey: "computer.doc.desc" },
    { icon: Laptop, titleKey: "computer.training.title", descKey: "computer.training.desc" },
  ];

  const graphicServices = [
    { icon: Palette, titleKey: "graphic.logo.title", descKey: "graphic.logo.desc" },
    { icon: Layers, titleKey: "graphic.brand.title", descKey: "graphic.brand.desc" },
    { icon: Smartphone, titleKey: "graphic.social.title", descKey: "graphic.social.desc" },
    { icon: Image, titleKey: "graphic.banner.title", descKey: "graphic.banner.desc" },
    { icon: FileText, titleKey: "graphic.print.title", descKey: "graphic.print.desc" },
    { icon: MessageCircle, titleKey: "graphic.consultation.title", descKey: "graphic.consultation.desc" },
  ];

  const videoServices = [
    { icon: Film, titleKey: "video.promo.title", descKey: "video.promo.desc" },
    { icon: Clapperboard, titleKey: "video.reels.title", descKey: "video.reels.desc" },
    { icon: Video, titleKey: "video.motion.title", descKey: "video.motion.desc" },
    { icon: Zap, titleKey: "video.events.title", descKey: "video.events.desc" },
  ];

  const digitalMarketingServices = [
    { icon: Target, titleKey: "dm.socialAds.title", descKey: "dm.socialAds.desc" },
    { icon: BarChart3, titleKey: "dm.googleAds.title", descKey: "dm.googleAds.desc" },
    { icon: Megaphone, titleKey: "dm.content.title", descKey: "dm.content.desc" },
    { icon: Users, titleKey: "dm.leads.title", descKey: "dm.leads.desc" },
  ];

  const processSteps = [
    { step: "01", titleKey: "services.process.discover", descKey: "services.process.discoverDesc", icon: Search },
    { step: "02", titleKey: "services.process.design", descKey: "services.process.designDesc", icon: PenTool },
    { step: "03", titleKey: "services.process.develop", descKey: "services.process.developDesc", icon: Code },
    { step: "04", titleKey: "services.process.deliver", descKey: "services.process.deliverDesc", icon: Zap },
  ];

  return (
    <LayoutComponent>
      {/* Hero Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-primary text-sm font-medium tracking-wider uppercase mb-4 block"
            >
              {t("services.subtitle")}
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl lg:text-6xl font-display font-bold mb-6"
            >
              {t("services.title")} <span className="gradient-text">{t("services.title2")}</span> {t("services.title3")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground max-w-3xl mx-auto"
            >
              {t("services.description")}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Main Services Grid */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-display font-bold mb-4">{t("services.whatWeOffer")}</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {t("services.whatWeOfferDesc")}
              </p>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              {allServices.map((service, index) => (
                <motion.div
                  key={service.titleKey}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-500"
                >
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                    <service.icon size={32} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-display font-semibold mb-3">{t(service.titleKey)}</h3>
                  <p className="text-muted-foreground mb-6">{t(service.descKey)}</p>
                  <ul className="space-y-2">
                    {service.features.map((featureKey) => (
                      <li key={featureKey} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle size={14} className="text-primary" />
                        {t(featureKey)}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Graphic Design Services */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 mb-12"
            >
              <span className="w-12 h-px bg-primary" />
              <h2 className="text-3xl font-display font-bold">{t("services.graphicDesign")}</h2>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
              {graphicServices.map((service, index) => (
                <motion.div
                  key={service.titleKey}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group flex items-start gap-4 p-6 rounded-xl bg-secondary/50 border border-border hover:border-primary/30 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors duration-300">
                    <service.icon size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-display font-semibold mb-1">{t(service.titleKey)}</h3>
                    <p className="text-muted-foreground text-sm">{t(service.descKey)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Video Editing Services */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 mb-12"
            >
              <span className="w-12 h-px bg-primary" />
              <h2 className="text-3xl font-display font-bold">{t("services.videoEditing")}</h2>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              {videoServices.map((service, index) => (
                <motion.div
                  key={service.titleKey}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group flex items-start gap-4 p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors duration-300">
                    <service.icon size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-display font-semibold mb-1">{t(service.titleKey)}</h3>
                    <p className="text-muted-foreground text-sm">{t(service.descKey)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Digital Marketing Services */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 mb-12"
            >
              <span className="w-12 h-px bg-primary" />
              <h2 className="text-3xl font-display font-bold">{t("services.digitalMarketing")}</h2>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              {digitalMarketingServices.map((service, index) => (
                <motion.div
                  key={service.titleKey}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group flex items-start gap-4 p-6 rounded-xl bg-secondary/50 border border-border hover:border-primary/30 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors duration-300">
                    <service.icon size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-display font-semibold mb-1">{t(service.titleKey)}</h3>
                    <p className="text-muted-foreground text-sm">{t(service.descKey)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Computer Operation Services */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 mb-12"
            >
              <span className="w-12 h-px bg-primary" />
              <h2 className="text-3xl font-display font-bold">{t("services.computerOperation")}</h2>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
              {computerServices.map((service, index) => (
                <motion.div
                  key={service.titleKey}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group flex items-start gap-4 p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors duration-300">
                    <service.icon size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-display font-semibold mb-1">{t(service.titleKey)}</h3>
                    <p className="text-muted-foreground text-sm">{t(service.descKey)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl lg:text-4xl font-display font-bold mb-4">
                {t("services.process.title")}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {t("services.process.desc")}
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
              {processSteps.map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-6 rounded-2xl bg-card border border-border"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <item.icon size={24} className="text-primary" />
                  </div>
                  <div className="text-3xl font-display font-bold gradient-text mb-2">{item.step}</div>
                  <h3 className="text-xl font-display font-semibold mb-2">{t(item.titleKey)}</h3>
                  <p className="text-muted-foreground text-sm">{t(item.descKey)}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl lg:text-4xl font-display font-bold mb-6">
              {t("services.cta.title")}
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              {t("services.cta.desc")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-medium text-lg transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
              >
                {t("services.cta.button")} <ArrowRight size={20} />
              </Link>
              <a
                href="https://wa.me/8801410190019"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-secondary border border-border text-foreground rounded-xl font-medium text-lg hover:bg-secondary/80 transition-all duration-300"
              >
                {t("services.cta.whatsapp")}
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </LayoutComponent>
  );
};

export default ServicesPage;