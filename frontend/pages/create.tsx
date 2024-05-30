import { ChevronDownIcon, CloseIcon } from "@chakra-ui/icons";
import {
  VStack,
  Text,
  Progress,
  HStack,
  Image,
  Input,
  Checkbox,
  Button,
  Box,
  Divider,
  Highlight,
  Textarea,
  SimpleGrid,
  Spinner,
} from "@chakra-ui/react";
import { categories } from "@data/categories";
import Confetti from "react-confetti";
import { FiChevronDown } from "react-icons/fi";
import { countries } from "@data/countries";
import styles from "@styles/List.module.css";
import { numberWithCommas } from "@utils/utils";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState, useContext, useMemo, useCallback } from "react";
import { BsCheck } from "react-icons/bs";
import { useDropzone } from "react-dropzone";
import { ScaleFade } from "@chakra-ui/react";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { FundraiserContext } from "../context/FundraiserContext";
import { AuthContext } from "@/context/AuthContext";
import styled from "styled-components";
import SignIn from "@components/signIn";

const projectId = process.env.NEXT_PUBLIC_INFURA_IPFS_PROJECT_ID;
const projectSecret = process.env.NEXT_PUBLIC_INFURA_IPFS_PROJECT_SECRET;
const projectIdAndSecret = `${projectId}:${projectSecret}`;

const client = ipfsHttpClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: `Basic ${Buffer.from(projectIdAndSecret).toString(
      "base64"
    )}`,
  },
});

const StyledButton = styled.button`
  cursor: pointer;
  position: relative;
  display: inline-block;
  padding: 14px 24px;
  color: #ffffff;
  background: #1a88f8;
  width: 540px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8rem;
  box-shadow: 0 4px 24px -6px #1a88f8;

  @media (max-width: 600px) {
    width: 300px;
  }

  transition: 200ms ease;
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 6px 40px -6px #1a88f8;
  }
  &:active {
    transform: translateY(-3px);
    box-shadow: 0 6px 32px -6px #1a88f8;
  }

  &:disabled,
  button[disabled] {
    border: 1px solid #999999;
    color: #ffffff;
    background: #83bffb !important;
    cursor: no-drop;
  }
`;

function List() {
  const [address, setAddress] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [categorie, setCategories] = useState<any>([]);
  const [tokenName, setTokenName] = useState<string>("");
  const [symbol, setSymbol] = useState<string>("");
  const [milestone, setMileStone] = useState<number>();
  const [amount, setAmount] = useState<number>();
  const [isTxnSuccessful, setTxnSuccessful] = useState<boolean>(false);
  const [fileUrl, setFileUrl] = useState<Array<string>>([]);
  const { currentAccount } = useContext(AuthContext);
  const { createAFundraiser, isLoadingFundraiser } =
    useContext(FundraiserContext);

  const [currentStep, setCurrentStep] = useState(0);

  const uploadToInfura = async (file: any) => {
    try {
      const added = await client.add({ content: file });

      const url = `https://nft-kastle.infura-ipfs.io/ipfs/${added.path}`;

      setFileUrl((prev) => [...prev, url]);

      return url;
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  };

  const router = useRouter();

  function handleAddressChange(e: any) {
    setAddress(e.target.value);
  }

  function handleAmountChange(e: any) {
    setAmount(e.target.value);
  }

  const createFundraiser = async () => {

    if (!title || !description || !fileUrl || !amount || !milestone || !tokenName || !symbol || !country) return;
     console.log("next")

    try {
      const res = await createAFundraiser(
        amount,
        milestone,
        tokenName,
        symbol,
        title,
        fileUrl,
        categories,
        description,
        country
      );

      console.log(res)
      //setTxnSuccessful(true);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
    });
  };

  useEffect(() => {
    scrollToTop();
  }, []);

  if (isTxnSuccessful) {
    return (
      <VStack minH="100vh" pt="2rem" className={styles.successContainer}>
        <Confetti className="w-full h-screen" recycle={true} />
        <Text className={styles.title}>Congrats, your campaign is listed!</Text>
        <ScaleFade initialScale={0.5} in={isTxnSuccessful}>
          <Image
            alt="success image"
            src="/success.webp"
            className={styles.successImage}
          />
        </ScaleFade>
        <Text className={styles.successText}>
          <Text as="span" className={styles.successTextHeavy}>
            {title}
          </Text>{" "}
          has been successfully listed on CrowdFlow. You can edit the campaign
          anytime.
        </Text>
        <VStack className={styles.buttonContainer}>
          <Link href="/browse">
            <Button className={styles.viewCauseBtn}>View campaign</Button>
          </Link>
        </VStack>
      </VStack>
    );
  }

  if (currentStep === 4)
    return (
      <ReviewCause
        createFundraiser={createFundraiser}
        title={title}
        description={description}
        goal={amount}
        country={country}
        address={address}
        categories={categorie}
        fileUrl={fileUrl}
        setTxnSuccessful={setTxnSuccessful}
      />
    );

  function getComponent() {
    switch (currentStep) {
      case 0:
        return (
          <StepOne
            handleAddressChange={handleAddressChange}
            currentAccount={currentAccount}
            handleAmountChange={handleAmountChange}
            milestone={milestone}
            amount={amount}
            setMileStone={setMileStone}
            setCurrentStep={setCurrentStep}
          />
        );

      case 1:
        return (
          <StepTwo
            setCategories={setCategories}
            setCountry={setCountry}
            setTitle={setTitle}
            setCurrentStep={setCurrentStep}
          />
        );
      case 2:
        return (
          <StepThree
            setDescription={setDescription}
            setTokenName={setTokenName}
            setSymbol={setSymbol}
            setCurrentStep={setCurrentStep}
          />
        );
      case 3:
        return (
          <StepFour
            uploadToInfura={uploadToInfura}
            setCurrentStep={setCurrentStep}
          />
        );
    }
  }

  return (
    <VStack
      minH="100vh"
      className="pt-[2rem] pb-[2rem] pl-[4rem] pr-[4rem] sm:pt-[2rem] sm:pb-[2rem] sm:pl-[0px] sm:pr-[0px]"
    >
      <Text className={styles.title}>Create a new Campaign</Text>

      <VStack className={styles.progressContainer}>
        <Box className="relative w-[550px] sm:w-full h-[5px] bg-[#bfb9b9] rounded-[5px]">
          <Box
            style={{
              backgroundColor: "#2d89e6",
              width: `${(((currentStep + 1) / 4) * 100).toFixed(0)}%`,
            }}
            className={`${styles.progressBar}`}
          ></Box>
          <HStack className={styles.progressBarDividers}>
            <Box pl="6px">
              <Box className={styles.progressBarDivider}></Box>
            </Box>
            <Box className={styles.progressBarDivider}></Box>
            <Box pr="7px">
              <Box className={styles.progressBarDivider}></Box>
            </Box>
          </HStack>
        </Box>
      </VStack>
      {getComponent()}
    </VStack>
  );
}

type StepOneProps = {
  handleAddressChange: (e: any) => void;
  handleAmountChange: (e: any) => void;
  amount: number;
  milestone: number;
  setCurrentStep: (step: any) => void;
  setMileStone: (e: any) => void;
  currentAccount: string;
};

function StepOne({
  handleAddressChange,
  handleAmountChange,
  amount,
  milestone,
  setCurrentStep,
  currentAccount,
  setMileStone,
}: StepOneProps) {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
    });
  };

  useEffect(() => {
    scrollToTop();
  }, []);

  return (
    <VStack>
      <VStack pb="2rem">
        <VStack className={styles.inputContainer}>
          <Text className={styles.inputHeader}>Default Network</Text>
          <HStack className="w-[550px] sm:w-[340px] h-[75px] p-[1rem] rounded-[15px] border-[2px] border-black">
            <Image
              alt="SUI logo"
              src="/sui-logo.png"
              className={styles.klaytnLogo}
            ></Image>
            <Text fontWeight={500}>SUI</Text>
          </HStack>
        </VStack>
        <VStack className={styles.inputContainer}>
          <Text className={styles.inputHeader}>Currency</Text>
          <HStack className="w-[550px] sm:w-[340px] h-[75px] p-[1rem] rounded-[15px] border-[2px] border-black">
            <Image
              alt="SUI logo"
              src="/sui-logo.png"
              className={styles.klaytnLogo}
            ></Image>
            <Text fontWeight={500}>SUI</Text>
          </HStack>
        </VStack>
        <VStack className={styles.inputContainer}>
          <Text className={styles.inputHeader}>Enter your campaign goal</Text>
          <Input
            type="number"
            onChange={handleAmountChange}
            className={styles.input}
          ></Input>
          <Text className={styles.inputUnit}>USD</Text>
        </VStack>
        <VStack className={styles.inputContainer}>
          <Text className={styles.inputHeader}>Enter your Mile stone</Text>
          <Input
            type="number"
            onChange={(e) => setMileStone(e.target.value)}
            className={styles.input}
          ></Input>
        </VStack>
      </VStack>
      {currentAccount ? (
        <StyledButton
          disabled={!amount || !milestone}
          className={styles.donateBtn}
          onClick={() => setCurrentStep((prev) => prev + 1)}
        >
          Next
        </StyledButton>
      ) : (
        <SignIn width="" />
      )}
    </VStack>
  );
}

type StepTwoProps = {
  setCategories: (cat: any) => void;
  setCountry: (country: any) => void;
  setTitle: (title: any) => void;
  setCurrentStep: (step: any) => void;
};

function StepTwo({
  setCategories,
  setCountry,
  setTitle,
  setCurrentStep,
}: StepTwoProps) {
  const [open, setOpen] = useState<string>("");
  const [isCountriesVisible, setCountriesVisible] = useState<boolean>();
  const [selectedCategories, setSelectedCategories] = useState({});
  const [selectedCountry, setSelectedCountry] = useState("");
  const [name, setname] = useState("");

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
    });
  };

  useEffect(() => {
    scrollToTop();
  }, []);

  function handleSelectCategories(category: string) {
    const copiedCategories = { ...selectedCategories };
    if (selectedCategories[category]) {
      delete copiedCategories[category];
    } else {
      copiedCategories[category] = true;
    }
    setSelectedCategories(copiedCategories);
    setCategories(Object.keys(copiedCategories));
  }

  function handleCountryChange(country) {
    setSelectedCountry(country);
    setCountry(country);
    setCountriesVisible(false);
  }

  function handleTitleChange(e) {
    setTitle(e.target.value);
    setname(e.target.value);
  }

  const isValidForm =
    name && selectedCountry && Object.keys(selectedCategories).length > 0;

  return (
    <VStack>
      <VStack pb="2rem">
        <VStack className={styles.inputContainer}>
          <Text className={styles.inputHeader}>Campaign title</Text>
          <Input onChange={handleTitleChange} className={styles.input}></Input>
        </VStack>
        <VStack className={`${styles.inputContainer} w-full`}>
          <Text className={styles.inputHeader}>Choose categories</Text>
          <div className="container">
            <div
              className={`select-btn ${open}`}
              onClick={() => (open === "" ? setOpen("open") : setOpen(""))}
            >
              {Object.keys(selectedCategories).length === 0 ? (
                <>
                  <span className="btn-text font-bold">Select categories</span>
                  <span className="arrow-dwn text-white font-bold">
                    <FiChevronDown className="text-white" />
                  </span>
                </>
              ) : (
                <>
                  <span className="btn-text font-bold">
                    {Object.keys(selectedCategories).length} Selected
                  </span>
                  <span className="arrow-dwn text-white font-bold">
                    <FiChevronDown className="text-white" />
                  </span>
                </>
              )}
            </div>

            <ul className="list-items">
              {categories.map((category, idx) => (
                <li
                  className={`item ${
                    Object.keys(selectedCategories).includes(category)
                      ? "checked"
                      : ""
                  }`}
                  key={idx}
                  onClick={() => handleSelectCategories(category)}
                >
                  <span className="checkbox text-white">
                    <BsCheck />
                  </span>
                  <span className="item-text">{category}</span>
                </li>
              ))}
            </ul>
          </div>
        </VStack>
        <VStack className={styles.inputContainer}>
          <Text className={styles.inputHeader}>Where are you based?</Text>
          <HStack
            className={styles.selectBox}
            onClick={() => setCountriesVisible(!isCountriesVisible)}
          >
            {selectedCountry ? (
              <Text fontWeight={500}>{selectedCountry}</Text>
            ) : (
              <Text fontWeight={500}>Select country</Text>
            )}
            <ChevronDownIcon className={styles.chevronIcon} />
          </HStack>
          {isCountriesVisible && (
            <VStack className={styles.selectionContainer}>
              {countries.map((cite, idx) => (
                <VStack key={idx} onClick={() => handleCountryChange(cite)}>
                  <HStack className={styles.countriesBox}>
                    <Text className={styles.checkboxTitle}>{cite}</Text>
                  </HStack>
                  <Divider></Divider>
                </VStack>
              ))}
            </VStack>
          )}
        </VStack>
      </VStack>
      <StyledButton
        disabled={!isValidForm}
        className={styles.donateBtn}
        onClick={() => setCurrentStep((prev) => prev + 1)}
      >
        Next
      </StyledButton>
    </VStack>
  );
}

type StepThreeProps = {
  setCurrentStep: (step: any) => void;
  setDescription: (desc: any) => void;
  setTokenName: (e: any) => void;
  setSymbol: (e: any) => void;
};

function StepThree({
  setCurrentStep,
  setDescription,
  setTokenName,
  setSymbol,
}: StepThreeProps) {
  const [text, setText] = useState();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
    });
  };

  useEffect(() => {
    scrollToTop();
  }, []);

  function handleTextChange(e) {
    setText(e.target.value);
    setDescription(e.target.value);
  }

  return (
    <VStack>
      <VStack pb="2rem">
        <VStack className={styles.inputContainer}>
          <Text className={styles.inputHeader}>Description</Text>
          <Textarea
            onChange={(e) => handleTextChange(e)}
            className={styles.textarea}
          ></Textarea>
          <Text className={styles.inputDescription}>
            This text will show up in the “About” section of your campaign
            detail page.
          </Text>
        </VStack>
        <VStack className={styles.inputContainer}>
          <Text className={styles.inputHeader}>Enter Token Name</Text>
          <Input
            type="text"
            onChange={(e) => setTokenName(e.target.value)}
            className={styles.input}
          ></Input>
        </VStack>
        <VStack className={styles.inputContainer}>
          <Text className={styles.inputHeader}>Enter Token Symbol</Text>
          <Input
            type="text"
            onChange={(e) => setSymbol(e.target.value)}
            className={styles.input}
          ></Input>
        </VStack>
      </VStack>
      <StyledButton
        className={styles.donateBtn}
        disabled={!text}
        onClick={() => setCurrentStep((prev) => prev + 1)}
      >
        Next
      </StyledButton>
    </VStack>
  );
}

type StepFourProps = {
  uploadToInfura: (files: any) => void;
  setCurrentStep: (step: any) => void;
};

function StepFour({ uploadToInfura, setCurrentStep }: StepFourProps) {
  const [files, setFiles] = useState<any[]>([]);

  const onDrop = useCallback(async (acceptedFile) => {
    const res = await uploadToInfura(acceptedFile[0]);
    setFiles((prev) => [...prev, res]);
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    // @ts-ignore TODO: fix typescript error
    accept: "image/*",
    maxSize: 5000000,
  });

  // add tailwind classes acording to the file status
  const fileStyle = useMemo(
    () =>
      `dark:bg-nft-black-1 bg-white border dark:border-white border-nft-gray-2 flex flex-col items-center p-5 rounded-sm border-dashed  
       ${isDragActive ? " border-file-active " : ""} 
       ${isDragAccept ? " border-file-accept " : ""} 
       ${isDragReject ? " border-file-reject " : ""}`,
    [isDragActive, isDragReject, isDragAccept]
  );

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
    });
  };

  const removeItem = (file: string) => {
    const index = files.indexOf(file);
    if (index > -1) {
      // only splice array when item is found
      files.splice(index, 1); // 2nd parameter means remove one item only
    }
  };

  useEffect(() => {
    scrollToTop();
  }, []);

  return (
    <VStack className="p-4">
      <VStack pb="2rem">
        <VStack className={styles.inputContainer}>
          <Text className={styles.inputHeader}>Add images</Text>

          <div className="mt-4">
            <div {...getRootProps()} className={fileStyle}>
              <input {...getInputProps()} />
              <div className="flexCenter flex-col text-center">
                <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl">
                  JPG, PNG, GIF, SVG, WEBM, MP3, MP4. Max 100mb.
                </p>

                <div className="my-12 w-full flex justify-center">
                  <Image
                    src="/upload.png"
                    alt="file upload"
                    className={"filter invert"}
                  />
                </div>

                <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-sm">
                  Drag and Drop File
                </p>
                <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-sm mt-2">
                  Or browse media on your device
                </p>
              </div>
            </div>
          </div>
          <Text className={styles.inputDescription}>
            Select 3 images to showcase your campaign.
          </Text>
          <div className="flex flex-wrap sm:space-x-0 space-x-2 justify-center items-center w-full">
            {files.slice(0, 3).map((file) => (
              <VStack key={file} className={styles.previewImageContainer}>
                <VStack className={styles.closeBtn}>
                  <CloseIcon
                    w={3}
                    h={3}
                    onClick={() => removeItem(file)}
                    className="cursor-pointer"
                  />
                </VStack>
                <Image
                  alt="uploaded file"
                  src={file ?? ""}
                  className={styles.previewImage}
                />
              </VStack>
            ))}
          </div>
        </VStack>
      </VStack>
      <StyledButton
        disabled={files.length < 3}
        className={styles.donateBtn}
        onClick={() => setCurrentStep((prev) => prev + 1)}
      >
        Next
      </StyledButton>
    </VStack>
  );
}

type ReviewCauseProps = {
  title: string;
  description: string;
  goal: number;
  country: string;
  address: string;
  categories: Array<string>;
  fileUrl: Array<string>;
  setTxnSuccessful: (bool: boolean) => void;
  createFundraiser: () => void;
};

function ReviewCause({
  createFundraiser,
  title,
  description,
  goal,
  country,
  address,
  categories,
  fileUrl,
  setTxnSuccessful,
}: ReviewCauseProps) {
  const [isLoading, setIsLoading] = useState(false);
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
    });
  };

  async function handleListCause() {
    setIsLoading(true);
    await createFundraiser();
    setTimeout(() => {
      scrollToTop();
      setTxnSuccessful(true);
      setIsLoading(false);
    }, 3000);
  }

  return (
    <VStack minH="100vh" p="2rem 4rem 3rem 4rem">
      <VStack>
        <Text className={styles.title}>Review your campaign</Text>
        <HStack className={styles.subtitleContainer}>
          <Text className={styles.subtitle}>Your campaign</Text>
          <Image
            alt="check logo"
            src="/chec.png"
            className={styles.checkLogo}
          ></Image>
        </HStack>
        <VStack className={styles.reviewContainer}>
          <Text className={styles.inputHeader}>Default Network</Text>
          <HStack>
            <Image
              alt="SUI logo"
              src="/sui-logo.png"
              className={styles.klaytnLogo}
            ></Image>
            <Text fontWeight={500}>SUI</Text>
          </HStack>
          <Divider />
        </VStack>
        <VStack className={styles.reviewContainer}>
          <Text className={styles.inputHeader}>Currency</Text>
          <HStack>
            <Image
              alt="SUI logo"
              src="/sui-logo.png"
              className={styles.klaytnLogo}
            ></Image>
            <Text fontWeight={500}>SUI</Text>
          </HStack>
          <Divider />
        </VStack>
        <VStack className={styles.reviewContainer}>
          <Text className={styles.inputHeader}>Campaign goal</Text>
          <Text fontWeight={500}>{numberWithCommas(goal)} USD</Text>
          <Divider />
        </VStack>

        <HStack className={styles.subtitleContainer}>
          <Text className={styles.subtitle}>Campaign Info</Text>
          <Text className={styles.editBtn}>Edit</Text>
        </HStack>
        <VStack className={styles.reviewContainer}>
          <Text className={styles.inputHeader}>Campaign title</Text>
          <HStack>
            <Text fontWeight={500}>{title}</Text>
          </HStack>
          <Divider />
        </VStack>
        <VStack className={styles.reviewContainer}>
          <Text className={styles.inputHeader}>Chosen categories</Text>
          <HStack className={styles.tagContainer}>
            {categories.map((tag, idx) => (
              <Text key={idx} className={styles.causeTag}>
                {tag}
              </Text>
            ))}
          </HStack>
          <Divider />
        </VStack>
        <VStack className={styles.reviewContainer}>
          <Text className={styles.inputHeader}>Location</Text>
          <Text fontWeight={500}>{country}</Text>
          <Divider />
        </VStack>

        <HStack className={styles.subtitleContainer}>
          <Text className={styles.subtitle}>Description</Text>
          <Text className={styles.editBtn}>Edit</Text>
        </HStack>
        <VStack className={styles.reviewContainer}>
          <Text className={styles.inputHeader}>About</Text>
          <VStack>
            <Text
              fontWeight={500}
              className="sm:w-[340px] w-[600px]"
              pb={"1rem"}
            >
              {description}
            </Text>
          </VStack>
          <Divider />
        </VStack>

        <HStack className={styles.subtitleContainer}>
          <Text className={styles.subtitle}>Cover image</Text>
          <Text className={styles.editBtn}>Edit</Text>
        </HStack>
        <VStack className={styles.reviewContainer}>
          <Text className={styles.inputHeader}>3 images uploaded</Text>
          <SimpleGrid columns={3} gap={3}>
            {fileUrl.map((file) => (
              <VStack key={file} className={styles.previewImageContainer}>
                {file}
                <Image
                  alt="uploaded file"
                  src={file ?? ""}
                  className={styles.previewImage}
                />
              </VStack>
            ))}
          </SimpleGrid>
          <Divider />
        </VStack>

        <StyledButton
          disabled={false}
          className={styles.donateBtn}
          onClick={handleListCause}
        >
          {isLoading ? <Spinner color="white" /> : "List campaign"}
        </StyledButton>
      </VStack>
    </VStack>
  );
}

export default List;
